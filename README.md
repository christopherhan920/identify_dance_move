# Identify Dance Move
## Dependencies

Recommended to download Miniconda (and Git is required if you don't have it already).
Once you have conda installed, run

> conda env create -f environment.yml

This will set up a conda environment for you.

Run the following to update the environment.

> conda env update -f environment.yml --prune

#### Open Cv
If installing through Conda 
> conda install opencv -c conda-forge

#### CVZone
> pip install cvzone

#### Mediapipe
> pip install mediapipe

You many need to downgrade protobuf.
You can uninstall
>pip uninstall protobuf
>pip install protobuf~=3.19.0
