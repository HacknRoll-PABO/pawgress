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


@app.route("/suggest/category", methods=["POST"])
def suggest_category():
    with open("prompts/category_prompt.txt") as f:
        prompt = f.read()

    task = request.json
    completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": prompt,
            },
            {"role": "user", "content": json.dumps(task)},
        ],
        model="gpt-4o",
    )
    return json.dumps({"suggestion": completion.choices[0].message.content})


app.run(debug=True)
