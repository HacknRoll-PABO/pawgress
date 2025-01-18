from flask import Flask, request
from datetime import date
from openai import OpenAI
import os
import json

app = Flask(__name__)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)
today = date.today()
db = SQL("sqlite:///task_list.db")

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
    task = json.loads(request.data)
    task_id = task.get("id")
    task_name = task.get("content")
    task_priority = task.get("priority")
    task_completion = task.get("completed")
    task_date = today.strftime("%d/%m/%Y")

    db.execute("INSERT INTO task_list (task_id, task_name, task_desc, task_priority, task_date) VALUES(?, ?, ?, ?, ?);", task_id, task_name, task_priority, task_completion, task_date)
    return "Hello"


@app.route("/removetask", methods=["POST"])
def remove_task():
    task = json.loads(request.data)
    task_id = task.get("id")

    user_data = db.execute("DELETE * from task_list WHERE task_id = ?;", task_id)
    return "Hello"


@app.route("/updatetask", methods=["POST"])
def update_task():
    task = json.loads(request.data)
    task_id = task.get("id")
    task_name = task.get("content")
    task_priority = task.get("priority")
    task_completion = task.get("completed")
    task_date = today.strftime("%d/%m/%Y")

    db.execute("UPDATE task_list SET (task_name, task_desc, task_priority, task_date) VALUES(?, ?, ?, ?) WHERE id = ?;", task_name, task_priority, task_completion, task_date, task_id)
    return "Hello"


@app.route("/suggest/category")
def suggest_category():
    return "Hello"


app.run(debug=True)
