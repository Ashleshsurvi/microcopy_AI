from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

print(os.getenv("OPENAI_API_KEY"))

USE_DUMMY_DATA = True

class GenerateMicrocopy(APIView):
    def post(self, request):
        text = request.data.get("text")
        tone = request.data.get("tone")
        if not text:
            return Response(
                {"error": "Text is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if USE_DUMMY_DATA:
            print("Making dummy data response for the api")
            dummy_alternatives = [
                f"{tone} Variation 1: Example output.",
                f"{tone} Variation 2: Another example.",
                f"{tone} Variation 3: More dummy text.",
                f"{tone} Variation 4: Just testing.",
                f"{tone} Variation 5: Final sample."
            ]
            return Response({"alternatives": dummy_alternatives})

        prompt = (
            f"Give 5 short variations of: \"{text}\" in a {tone} tone."
        )

        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You create short call-to-action variations."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=80
            )

            # Extract generated text 
            content = response.choices[0].message.content

            # Split into alternatives by line.
            alternatives = [
                line.strip("0123456789. ").strip().strip('"')
                for line in content.strip().split("\n")
                if line.strip()
            ]
            print(response.usage)

            return Response({"alternatives": alternatives})

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
