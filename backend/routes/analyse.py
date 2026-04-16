from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
from services.ocr_service import extract_text_from_image
from services.ollama_service import analyse_text
from services.mongo_service import save_finding
from datetime import datetime

router = APIRouter()

@router.post("/analyse")
async def analyse(
    input_text: Optional[str] = Form(None),
    input_url: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None)
):
    text = ""
    input_method = ""

    if file:
        contents = await file.read()
        text = extract_text_from_image(contents)
        input_method = "screenshot"
        if not text:
            raise HTTPException(400, "Could not extract text from image. Try a clearer screenshot.")

    elif input_url:
        text = f"Suspicious URL submitted for analysis: {input_url}"
        input_method = "url"

    elif input_text:
        text = input_text
        input_method = "text"

    else:
        raise HTTPException(400, "Provide a file, URL, or text.")

    try:
        result = await analyse_text(text)
    except Exception as e:
        raise HTTPException(500, f"Ollama analysis failed: {str(e)}")

    result["raw_input"] = text[:500]
    result["input_method"] = input_method
    result["detected_at"] = datetime.utcnow()
    result["source"] = "User Submission"

    save_finding(result)
    return result
