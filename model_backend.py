import json
from flask import Flask, request, jsonify

from tensorflow import keras
import tensorflow as tf
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split

import cv2
import os
import pickle
import base58

# PARAMETERS
IMG_SIZE = 224
BATCH_SIZE = 64
EPOCHS = 50
MAX_SEQ_LENGTH = 20
NUM_FEATURES = 2048
model_path = 'model_1_09052022'

app = Flask(__name__)

@app.route('/', methods=['GET'])
def GET():
    # testing loading model
    # model = keras.models.load_model(model_path)
    # return 'loaded model: {}'.format(model_path)
    return jsonify({'move_1': 'percentage_1', 'move_2': 'percentage_2', 'move_3': 'percentage_3', 'move_4': 'percentage_4'})

# Helper functions for the POST method

def crop_center_square(frame):
    y, x = frame.shape[0:2]
    min_dim = min(y, x)
    start_x = (x // 2) - (min_dim // 2)
    start_y = (y // 2) - (min_dim // 2)
    return frame[start_y : start_y + min_dim, start_x : start_x + min_dim]


def load_video(path: str, max_frames=0, resize=(IMG_SIZE, IMG_SIZE)):
    cap = cv2.VideoCapture(path)
    frames = []
    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            frame = crop_center_square(frame)
            frame = cv2.resize(frame, resize)
            frame = frame[:, :, [2, 1, 0]]
            frames.append(frame)

            if len(frames) == max_frames:
                break
    finally:
        cap.release()
    return np.array(frames)

def build_feature_extractor():
    feature_extractor = keras.applications.InceptionV3(
        weights="imagenet",
        include_top=False,
        pooling="avg",
        input_shape=(IMG_SIZE, IMG_SIZE, 3),
    )
    preprocess_input = keras.applications.inception_v3.preprocess_input

    inputs = keras.Input((IMG_SIZE, IMG_SIZE, 3))
    preprocessed = preprocess_input(inputs)

    outputs = feature_extractor(preprocessed)
    return keras.Model(inputs, outputs, name="feature_extractor")

feature_extractor = build_feature_extractor()

def preprocess_video(path):

    # `frame_masks` and `frame_features` are what we will feed to our sequence model.
    # `frame_masks` will contain a bunch of booleans denoting if a timestep is
    # masked with padding or not.
    frame_masks = np.zeros(shape=(1, MAX_SEQ_LENGTH), dtype="bool")
    frame_features = np.zeros(
        shape=(1, MAX_SEQ_LENGTH, NUM_FEATURES), dtype="float32"
    )

    # Gather all its frames and add a batch dimension.
    frames = load_video(path)
    frames = frames[None, ...]

    # Initialize placeholders to store the masks and features of the current video.
    temp_frame_mask = np.zeros(shape=(1, MAX_SEQ_LENGTH,), dtype="bool")
    temp_frame_features = np.zeros(
        shape=(1, MAX_SEQ_LENGTH, NUM_FEATURES), dtype="float32"
    )

    # Extract features from the frames of the current video.
    for i, batch in enumerate(frames):
        video_length = batch.shape[0]
        length = min(MAX_SEQ_LENGTH, video_length)
        for j in range(length):
            temp_frame_features[i, j, :] = feature_extractor.predict(
                batch[None, j, :]
            )
        temp_frame_mask[i, :length] = 1  # 1 = not masked, 0 = masked

    frame_features[0,] = temp_frame_features.squeeze()
    frame_masks[0,] = temp_frame_mask.squeeze()

    return (frame_features, frame_masks)

def load_model():
    model = keras.models.load_model(model_path)
    print('loaded model: {}'.format(model_path))
    return model

# def predict(video: np.array) -> dict:
#     # take the input video as np.array and return prediction
#     print('predicting')

# @Crossorigin
@app.route('/post', methods=['POST'])
def POST():
    # convert video into byte array
    # decode it into video

    #temp_path = "http://Users/chris/identify_dance_move/output_video.mov"
    temp_path = 'output_video.mov'

    video_bytes = request.data

    # print("Request.data: ", request.data)

    if os.path.isfile(temp_path):
        os.remove(temp_path)

    with open(temp_path, "wb") as out_file:
        out_file.write(video_bytes)
    
    video_array = preprocess_video(temp_path)
    # from the point the video is a numpy array
    model = load_model()
    result = model.predict(video_array)[0]
    # print(result)
    result_dict = {'Stick and Roll': str(result[0]),
                    'Brooklyn': str(result[1]),
                    'Charleston': str(result[2]),
                    'Monastery': str(result[3])
                    }
    # print(result_dict)
    print(video_bytes)
    return jsonify(result_dict)

app.run(debug=True)