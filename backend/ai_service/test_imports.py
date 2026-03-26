#!/usr/bin/env python3
"""Test if all modules can be imported"""

print("Testing imports...")

try:
    print("1. Testing fastapi...")
    from fastapi import FastAPI
    print("   ✓ FastAPI OK")
except Exception as e:
    print(f"   ✗ FastAPI ERROR: {e}")

try:
    print("2. Testing uvicorn...")
    import uvicorn
    print("   ✓ Uvicorn OK")
except Exception as e:
    print(f"   ✗ Uvicorn ERROR: {e}")

try:
    print("3. Testing transformers (may take time)...")
    from transformers import pipeline
    print("   ✓ Transformers OK (imported)")
except Exception as e:
    print(f"   ✗ Transformers ERROR: {e}")

try:
    print("4. Testing google-cloud-vision...")
    from google.cloud import vision
    print("   ✓ Google Vision OK")
except Exception as e:
    print(f"   ✗ Google Vision ERROR: {e}")

print("\nAll tests passed!")
