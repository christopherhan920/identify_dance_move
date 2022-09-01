import json
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/', methods=['GET'])
def GET():
    return jsonify({'move_1': 'percentage_1', 'move_2': 'percentage_2', 'move_3': 'percentage_3', 'move_4': 'percentage_4'})

@app.route('/', methods=['POST'])
def POST():
    # convert video into byte array
    # decode it into video

    video_array = json.loads(request.data)
    return jsonify(video_array)

app.run(debug=True)