# Identify Dance Move

This is a web application for people to upload a short dance video and the app identifies which move it’s most similar to from popular foundation styles.

Project Timeline: June 2022 - Sep 2022

Project Outline: 
- Formulate end to end architecture and specify requirements
- Collect data and preprocess
- Create and validate the performance of various models
- Create a web application prototype
- Create a python backend for model prediction
- Integrate all into one to run locally
- STRETCH GOAL: Deploy onto a server with everything packaged

## Dependencies

Recommended to download Miniconda (and Git is required if you don't have it already).
Once you have conda installed, run

> conda env create -f environment.yml

This will set up a conda environment for you.

#### Open Cv
If installing through Conda 
> conda install opencv -c conda-forge

#### CVZone
> pip install cvzone

#### Mediapipe
> pip install mediapipe

You many need to downgrade protobuf.
You can uninstall # a why for later
>pip uninstall protobuf
>pip install protobuf~=3.19.0

#### Developer tools
- npm (comes with Node.js)
- React

## Contributors (alphabetical order)
- Chris Han
- Chris Ong
- Dorothy Nie
- Jonathan Esguerra
