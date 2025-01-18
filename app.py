from flask import Flask, request
from flask_cors import CORS
from datetime import date
from openai import OpenAI
import os
import json
import sqlite3

app = Flask(__name__)
CORS(app)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
today = date.today()

client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),  # This is the default and can be omitted
)


def get_db_connection():
    con = sqlite3.connect("task_list.db")
    con.row_factory = sqlite3.Row
    return con


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


@app.route("/addsubject", methods=["POST"])
def add_subject():
    subject = json.loads(request.data)
    subject_name = subject.get("name")

    with get_db_connection() as con:
        con.execute(
            "INSERT INTO subject_list (Name, ) VALUES(?, )",
            (subject_name,),
        )
        con.commit()
    return json.dumps({"Status": "Successful"})


@app.route("/addtask", methods=["POST"])
def add_task():
    task = json.loads(request.data)
    print(task)
    task_id = task.get("subject_id")
    task_name = task.get("name")
    task_priority = task.get("priority")
    # task_completion = task.get("completed")
    task_completion = "completed"
    task_date = today.strftime("%d/%m/%Y")

    with get_db_connection() as con:
        con.execute(
            "INSERT INTO task_list (id, Name, Priority, Completion, Date) VALUES(?, ?, ?, ?, ?)",
            (task_id, task_name, task_priority, task_completion, task_date),
        )
        con.commit()

    return json.dumps({"Status": "Successful"})


@app.route("/removetask", methods=["POST"])
def remove_task():
    task = json.loads(request.data)
    task_id = task.get("id")

    with get_db_connection() as con:
        con.execute("DELETE * from task_list WHERE id = ?", (task_id,))
        con.commit()

    return "Hello"


@app.route("/fetchtask", methods=["GET"])
def fetch_tasks():
    with get_db_connection() as con:
        con.row_factory = sqlite3.Row
        rows = con.execute("SELECT * FROM task_list").fetchall()

    return json.dumps(rows)


@app.route("/updatetask", methods=["POST"])
def update_task():
    task = json.loads(request.data)
    task_id = task.get("id")
    task_name = task.get("content")
    task_priority = task.get("priority")
    task_completion = task.get("completed")
    task_date = today.strftime("%d/%m/%Y")

    with get_db_connection() as con:
        con.execute(
            "UPDATE task_list SET (Name, Priority, Completion, Date) VALUES(?, ?, ?, ?) WHERE id = ?",
            (
                task_name,
                task_priority,
                task_completion,
                task_date,
                task_id,
            ),
        )
        con.commit()

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
