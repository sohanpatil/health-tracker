#!/usr/bin/python3
import csv
import json
import random
import math
import pandas as pd
from sklearn.cluster import KMeans
from flask import Flask, render_template, request, redirect, Response, jsonify, url_for
import myfitnesspal

app = Flask(__name__)

nutrition_dataset = pd.DataFrame()

@app.after_request
def add_header(r):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    r.headers['Cache-Control'] = 'public, max-age=0'
    return r

@app.route("/", methods = ['POST', 'GET'])
def home():
    global sohanpatil
    if request.method == 'GET':
        return render_template("index.html")

# Route for handling the login page logic
@app.route('/login', methods=['GET', 'POST'])
def login():
    global client
    error = None
    if request.method == 'POST':
        try:
            client = myfitnesspal.Client(request.form['username'],request.form['password'])
        except ValueError:
            error = 'Invalid Credentials. Please try again.'
        else:
            return redirect(url_for('home'))
    return render_template('login.html', error=error)


@app.route('/parallel')
def parallel():
    return render_template('parallel.html')

@app.route('/getParacoords')
def getParacoords():
    required_columns = request.args.get("required_columns").split(",")
    print(required_columns)
    global nutrition_dataset
    data = nutrition_dataset[required_columns]
    chart_data = data.to_dict(orient='records')
    #chart_data = json.dumps(chart_data, indent=2)

    data = {'chart_data': chart_data}
    return jsonify(data)

@app.route('/test')
def test():
    return render_template('test.html')

def readNutritionData():
    global nutrition_dataset
    nutrition_dataset = pd.read_csv("data.csv")
    data = nutrition_dataset
    chart_data = data.to_dict(orient='records')
    #chart_data = json.dumps(chart_data, indent=2)


if __name__ == '__main__':

    global client
    readNutritionData()
    
    app.run(debug=True)
    app.run(host="0.0.0.0", port=5000, debug=True, use_reloader=True)
