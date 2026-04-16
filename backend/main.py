from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.analyse import router as analyse_router
from routes.taxonomy import router as taxonomy_router
from routes.findings import router as findings_router

app = FastAPI(title="Phishing Intelligence Platform API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://phish.encryptbytes.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyse_router)
app.include_router(taxonomy_router)
app.include_router(findings_router)

@app.get("/")
def root():
    return {"status": "Phishing Intelligence Platform V1 running"}
