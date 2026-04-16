import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))
db = client["phishing_db"]

taxonomy_collection = db["taxonomy_preset"]
findings_collection = db["findings"]

def save_finding(data: dict):
    result = findings_collection.insert_one(data)
    return str(result.inserted_id)

def get_all_findings():
    return list(findings_collection.find({}, {"_id": 0}).sort("detected_at", -1))

def get_taxonomy():
    return list(taxonomy_collection.find({}, {"_id": 0}))

def get_stats():
    pipeline_by_type = [
        {"$group": {"_id": "$attack_type", "count": {"$sum": 1}}}
    ]
    pipeline_by_channel = [
        {"$group": {"_id": "$channel", "count": {"$sum": 1}}}
    ]
    pipeline_by_month = [
        {"$group": {
            "_id": {"$dateToString": {"format": "%Y-%m", "date": "$detected_at"}},
            "count": {"$sum": 1}
        }},
        {"$sort": {"_id": 1}}
    ]
    return {
        "by_type": list(findings_collection.aggregate(pipeline_by_type)),
        "by_channel": list(findings_collection.aggregate(pipeline_by_channel)),
        "by_month": list(findings_collection.aggregate(pipeline_by_month)),
        "total": findings_collection.count_documents({})
    }
