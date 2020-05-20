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
    import datetime 
    global client
    # # get last week's calorie and water intake
    global lastWeekCalorie
    global lastWeekWater
    lastWeekCalorie = []
    for i in range(7):
        tod = datetime.datetime.now()
        d = datetime.timedelta(days = i)
        a = tod - d
        #print(a.year, a.month, a.day)
        day = client.get_date(a.year, a.month, a.day)
        dayTotals = day.totals
        dayTotals['date'] = str(a.month)+"-"+str(a.day)+"-"+str(a.year)
        dayTotals['water'] = day.water
        lastWeekCalorie.append(dayTotals)

    if request.method == 'GET':
        return render_template("index.html")

@app.route('/getMFPWateCalorierData', methods=['GET', 'POST'])
def getMFPWaterData():
    global lastWeekCalorie # have merged water data into it
    return json.dumps(lastWeekCalorie)

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

@app.route('/test')
def testConnection():
    return "Connection Alive."

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

def readNutritionData():
    global nutrition_dataset
    nutrition_dataset = pd.read_csv("data.csv")

if __name__ == '__main__':

    global client
    global lastWeekCalorie
    global lastWeekWater
    readNutritionData()

    app.run(debug=True)
    app.run(host="0.0.0.0", port=5000, debug=True, use_reloader=True)
