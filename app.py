from flask import Flask, request
import os
from openai import OpenAI

app = Flask(__name__)

client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),  # This is the default and can be omitted
)


@app.route("/")
def home():
    return "Hello World"


@app.route("/onboarding", methods=["POST"])
def onboarding():
    writeup = request.form["writeup"]
    with open("prompts/category_prompt.txt", "a") as f:
        f.write("\n")
        f.write(
            "This is the background of the user whose tasks you will be categorising: \n"
        )
        f.write(writeup)
        f.write("\n\n\n")
        f.write("These are a few examples of tasks and their related categories: \n")
    return "Done onboarding"


@app.route("/addtask", methods=["POST"])
def add_task():
    return "Hello"


@app.route("/removetask", methods=["POST"])
def remove_task():
    return "Hello"


@app.route("/updatetask", methods=["POST"])
def update_task():
    return "Hello"


@app.route("/suggest/category")
def suggest_category():
    return "Hello"


app.run(debug=True)
