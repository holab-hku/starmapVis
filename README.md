<a href="url"><img src="QRcodeAndLogo/logo.png" align="left" height="108" alt="starmap"></a>
# StarmapVR: Immersive three dimensional visualisation of single cell data using smartphone-enabled virtual reality

Authors: Andrian Yang, Yu Yao, Jianfu Li and Joshua W. K. Ho

Contact: j.ho@victorchang.edu.au

Copyright © 2018, Victor Chang Cardiac Research Institute

## Synopsis

<a href="https://vccri.github.io/starmap/"><img src="QRcodeAndLogo/QR_Code_Star_Map.png" align="right" height="108" alt="starmap"></a>
starmap is a web-based VR-enabled tool which combines a 3D scatter plot with star plots (radar chart) to visualise hundreds of thousands of multivariate data points, such as single-cell expression data. starmap can be accessed from a desktop, laptop or a mobile device from the following link: [https://vccri.github.io/starmap/](https://vccri.github.io/starmap/), or the QR code. 

## Usage instructions

starmap supports a number of input methods for interacting with the visualisation - keyboard, remote control and voice control. Note that voice control is available only in Google Chrome (desktop and mobile) as voice control utilises the SpeechRecognition API which is currently only supported by Chrome.

A summary of the control scheme for keyboard and voice control is included in the table below.

| Command | keyboard control | voice command |
| ------- | ---------------- | ------------- |
| forward | w | forward |
| backward | s | backward |
| left | a | left |
| right | d | right |
| zoom in | q | in |
| zoom out | e | out | 
| rotate Y-axis clockwise | left arrow | N\A |
| rotate Y-axis anti-clockwise | right arrow | rotate |
| rotate X-axis clockwise | up arrow | N\A |
| rotate X-axis anti-clockwise | down arrow | N\A |
| click on toolbox (VR mode) | N\A | select |
| reset toolbox (VR mode) | N\A | reset |
| reset view (VR mode) | N\A | init |

The control scheme for remote control is shown below.

<a href="url"><img src="image/gamepad.png" align="left" alt="control scheme for remote control"></a>

## Customized Input data

StarmapVR accepts as input a csv file or a zip-compressed csv file. The csv file need to contain a header row with the following column names - x, y, z and cluster - corresponding to the 3D coordinates of points and the cluster label assigned for each point (with outliers assigned the value of -1). In addition to the required columns, starmap also accepts extra columns (up to 12) corresponding to features which will be visualised in the star plot. The values for all columns must be of numeric types.

To see an example of input data, please see the sampleData folder which contains two example datasets based on previously published single-cell RNA-seq data and flow cytometry data.

## Platform-compatible single-cell RNA-seq data visualization


To easily visualize your data from single-cell RNA-seq data analysis platform, we provide the funtion that can transform the Scanpy&Seurat result data to the required input for StarmapVR.
```sh
def adataTostarmap(adata, cord, featureN, valuetoplot, result_path):
    if cord == 'umap':
        cord_xyz = pd.DataFrame(adata.obsm['X_umap'],columns=['x', 'y'])
        cord_xyz['z'] = 1
    if cord == 'pca':
        cord_xyz = pd.DataFrame(adata.obsm['X_pca'][:,0:3], columns = ['x', 'y', 'z'])
    else:
        cord_x = pd.DataFrame(adata.obsm['X_pca'][:,int("pca_134".split("_")[1][0])-1], columns = ['x'])
        cord_y = pd.DataFrame(adata.obsm['X_pca'][:,int("pca_134".split("_")[1][1])-1], columns = ['y'])
        cord_z = pd.DataFrame(adata.obsm['X_pca'][:,int("pca_134".split("_")[1][2])-1], columns = ['z'])
        cord_xyz = pd.concat([cord_x,cord_y], axis=1, join='inner')
        cord_xyz = pd.concat([cord_xyz,cord_z], axis=1, join='inner')
        
    fcolumns = []
    features = {}
    for i in range(len(featureN)):
        fcolumns.append('PC'+str(featureN[i]))
        features[i] = list(adata.obsm['X_pca'][:,featureN[i]])
    pcs = pd.DataFrame.from_dict(features)
    pcs.columns = fcolumns

    if valuetoplot in adata.obs.columns:
        label = pd.DataFrame(adata.obs[valuetoplot])
        label['cluster'] = label[valuetoplot]
        label = label.reset_index()
    else:
        label = pd.DataFrame(adata.raw.obs_vector(valuetoplot).round(),columns = ['cluster'])

    adataStarmap = pd.concat([cord_xyz,pcs], axis=1, join='inner')
    adataStarmap = pd.concat([adataStarmap,label['cluster']], axis=1, join='inner')
    adataStarmap.to_csv(result_path,index = None)
```
Following is a example of using the function:

```sh
#Read the data from your scanpy result folder
adata = sc.read("~/write/pbmc3k.h5ad")
##Specify the corrdinates, features, cluster label and result path
    #cord can be 'umap', 'pca' or 'pca_'+numbers such as "pca_135", "umap" uses the umap values as 2D corrdinates, 'pca' takes pca_123 as 3D corrdinates, specific PC components are also acceptable.
cord = 'pca_135'
    #featureN takes a list of the number of PC components you want to use as features, max length is 12.
featureN = [1,2,3,4,5,6,7,8,9,10,11,12]
    #valuetoplot can be the same thing for Scanpy visualization, such as 'louvain' or Gene names
valuetoplot = 'louvain'

import scanpy as sc
import pandas as pd
result_path = '~/write/pbmc3k_starmap.csv'
adataTostarmap(adata, cord, featureN, valuetoplot, result_path)
```

## Visualization of spatial transcriptomics data
StarmapVR also accecpts spatial transcriptomics data processed by Scanpy.
```sh
def adataTostarmap_spatial(adata, cord, featureN, valuetoplot, result_path):
    cord_xyz = pd.DataFrame(adata.obsm['spatial'],columns=['x', 'y'])
    cord_xyz['z'] = 10

    fcolumns = []
    features = {}
    for i in range(len(featureN)):
        fcolumns.append('PC'+str(featureN[i]))
        features[i] = list(adata.obsm['X_pca'][:,featureN[i]])
    pcs = pd.DataFrame.from_dict(features)
    pcs.columns = fcolumns
    
    if valuetoplot in adata.obs.columns:
        label = pd.DataFrame(adata.obs[valuetoplot])
        label['cluster'] = label[valuetoplot]
        label = label.reset_index()
    else:
        label = pd.DataFrame(adata.obs_vector(valuetoplot).round(),columns = ['cluster'])

    adataStarmap = pd.concat([cord_xyz,pcs], axis=1, join='inner')
    adataStarmap = pd.concat([adataStarmap,label['cluster']], axis=1, join='inner')
    adataStarmap.to_csv(result_path,index = None)
```
Zip the csv file with the tissue image, StarmapVR can visualize the spatial trancriptomic data in spatial dimensions. An example file can be found in /sampledata/spl.zip.
## Visualization of Image cytometry data
For image cytometry data with actual cell image, user can zip their cell images(cell_index as the image name) with the requiring csv file, An example file can be found in /sampledata/ato.zip.
