# StarmapVis: A data story telling visualization tool for single-cell data

Authors: Xiunan Fang, Shichao Ma, Yu Yao, Crystal S. M. Kwok, Kevin K. Tsia

Contacts: Joshua W. K. Ho (jwkho@hku.hk)

## Abstract

A Web interface for visualisation of single cells called StarmapVis is integrated with other single cell analysis tool. StarmapVis enables an instant web dynamic visualization of spatial transcriptomic and single cell analysed result. Compared with the existing of single cell visualization tool, StarmapVis combines data visualisation with narratives that help better comprehension of single cell analyzed result.

Keywords: Web visualization, Single cell, Data story telling

## About the application

StarmapVis allows a viewer to assess the high-level clustering structure of cells and examine the interaction and connection between different coordinates, such as 3D projections and spatial coordinates. Users can follow the provided python and R scripts to obtain the proper input for StarmapVis. The output then can be accessed in browsers from a desktop, laptop or a mobile device. We provide multiple scripts for StarmapVis to easily integrate with other single cell analysis tool. The scripts covers widely-used python and R single cell analysis packages, including Scanpy and Seurat for general analysis, PAGA and Monocle3 fro trajectory inference, Scaranoma for integration analysis. You can find the scripts in https://github.com/holab-hku/starmapVis.

## Instructions

1.Cell information csv file needs to contain a header row with the following column names – x, y, z and labels – corresponding to the 3D coordinates of points and the cell label (e.g. clusters, gene markers, pseudotime, etc.).

2.Trajectory information csv file contains the following column names – name, x, y, z, children and root – corresponding to the names and 3D coordinates of edges and the connectivity amongst these edges. The animation path information can be provided by inputting the list of names of edges separated by space in the corresponding section.

3.History images can be uploaded by providing images in PNG format and specifying the coordinates of images in the image upload section.

4.Csv file with another set of coordinates of analysis can be provided in the last section if the user wants to animate the transformation from 2D to 3D.

Users can choose uploading a single cell csv file or a combination of several files and information to generate multiple kinds of visualization from a single-cell RNA-seq data to a narrative of spatial transcriptomic data.

## Contacts

Dr Joshua W.K. Ho: jwkho@hku.hk

Xiunan Fang: xiunanfang@connect.hku.hk

Shichao Ma: u3572177@connect.hku.hk

School of Biomedical Sciences, Li Ka Shing Faculty of Medicine, The University of Hong Kong, Pokfulam, Hong Kong SAR, China


