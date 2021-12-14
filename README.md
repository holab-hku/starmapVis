<a href="url"><img src="QRcodeAndLogo/StarmapVis.png" align="left" height="108" alt="starmap"></a>
# starmapVis: A data story telling visualisation tool for single-cell data
Authors: Xiunan Fang, Shichao Ma, Yu Yao, Andrian Yang and Joshua W. K. Ho

Contact: Joshua Ho (jwkho@hku.hk)


## Synopsis

<a href="https://holab-hku.github.io/starmapVR/"><img src="QRcodeAndLogo//StarmapVis.jpg" align="right" height="108" alt="starmap"></a>
StarmapVis enables an instance and interactive web visualisation for various single cell analysed results, including scatter plots with clustering information, connectivity network with trajectory and  cross-comparison among different coordinates. The clean and concise UI interface is designed for better user experience and also more suitable for scientific presentation. StarmapVis can be accessed from a desktop, laptop or a mobile device from the following link: [https://holab-hku.github.io/starmapVis/](https://holab-hku.github.io/starmapVis/), or the QR code. 
## Input data

The upload page includes five sections to let users upload different csv files and information including 1. cell csv file, 2. trajectory csv file, 3. animation path information, 4. histology images and 5. the transformed coordinates csv file. The cell information csv file needs to contain a header row with the following column names – x, y, z and labels – corresponding to the 3D coordinates of points and the cell label (e.g. clusters, gene markers, pseudotime, etc.). The trajectory information csv file contains the following column names – name, x, y, z, children and root – corresponding to the names and 3D coordinates of edges and the connectivity amongst these edges. The animation path information can be provided by inputting the list of names of edges separated by space in the corresponding section. The histology images can be uploaded by providing images in PNG format and specifying the coordinates of images in the image upload section. Finally, csv file which contains another set of coordinates of analysis can be provided in the last section if the user want to animate the transformation from 2D to 3D. Users can choose uploading a single cell csv file or a combination of several files and information to generate multiple kinds of visualization from a single-cell RNA-seq data to a narrative of spatial transcriptomic data.

To see an example of input data, please see the sampleData folder which contains example datasets based on previously published single-cell RNA-seq data, flow cytometry data and spatial transcriptomic data.

To easily visualize your data from single-cell RNA-seq data analysis platform, we provide the example scripts that can transform the Scanpy, Seurat, PAGA, Monocle3, Scaranoma results to the required input for StarmapVR.

## Single-cell RNA-seq data visualisation from Scanpy

```sh
def adataTostarmap(adata, cord, featureN, valuetoplot, result_path):
    if cord == 'umap':
        cord_xyz = pd.DataFrame(adata.obsm['X_umap'],columns=['x', 'y'])
        cord_xyz['z'] = 1
    if cord == 'pca':
        cord_xyz = pd.DataFrame(adata.obsm['X_pca'][:,0:3], columns = ['x', 'y', 'z'])
    else:
        cord_x = pd.DataFrame(adata.obsm['X_pca'][:,int(cord.split("_")[1][0])-1], columns = ['x'])
        cord_y = pd.DataFrame(adata.obsm['X_pca'][:,int(cord.split("_")[1][1])-1], columns = ['y'])
        cord_z = pd.DataFrame(adata.obsm['X_pca'][:,int(cord.split("_")[1][2])-1], columns = ['z'])
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
An example can be found in /Convert from Scanpy or Seurat/Convert from Scanpy.ipynb .
## Single-cell RNA-seq data visualisation from Seurat
```sh
library(dplyr)
library(Seurat)
#Read your data from Seurat result
pbmc <- readRDS(file = "filtered_gene_bc_matrices/output/pbmc_tutorial.rds")
pca_data <- pbmc[['pca']]@cell.embeddings
pca_data <- data.frame(pca_data)
#Select PC1,2,3 as 3D coordinates
pca_3d <- pca_data %>% select(1,2,3)
names(pca_3d)[1] <- "x"
names(pca_3d)[2] <- "y"
names(pca_3d)[3] <- "z"
#Select PC1,2,3,4,5,6,7,8,9,10,11,12 as 12 features
feature_data <- pca_data %>% select(1,2,3,4,5,6,7,8,9,10,11,12)
#Obtain the clustering result
cluster <- Idents(pbmc)
cluster <- data.frame(cluster)
pbmc_starmap <- bind_cols(pca_3d, feature_data)
pbmc_starmap <- bind_cols(pbmc_starmap, cluster)
#write the file into your result path
write.csv(pbmc_starmap,"filtered_gene_bc_matrices/output/pbmc_starmap.csv",row.names=F)
```
An example can be found in /Convert from Scanpy or Seurat/Convert from Seurat.ipynb .
## Visualisation of spatial transcriptomics data
StarmapVR also accecpts spatial transcriptomics data processed by Scanpy.
```sh
def adataTostarmap_spatial(adata, featureN, valuetoplot, result_path):
    cord_xyz = adata.uns['spatial']['V1_Human_Lymph_Node']['scalefactors']['tissue_hires_scalef']*\
                pd.DataFrame(adata.obsm['spatial'],columns=['x', 'y'])
    cord_xyz['z'] = 1
    fcolumns = []
    features = {}
    for i in range(len(featureN)):
        fcolumns.append('PC'+str(featureN[i]))
        features[i] = list(adata.obsm['X_pca'][:,featureN[i]])
    pcs = pd.DataFrame.from_dict(features)
    pcs.columns = fcolumns
    
    if valuetoplot == 'leiden' or 'louvain':
        label = pd.DataFrame(adata.obs[valuetoplot])
        label['cluster'] = label[valuetoplot]
        label = label.reset_index()
    else:
        label = pd.DataFrame(adata.obs_vector(valuetoplot).round(),columns = ['cluster'])
    adataStarmap = pd.concat([cord_xyz,pcs], axis=1, join='inner')
    adataStarmap = pd.concat([adataStarmap,label['cluster']], axis=1, join='inner')
    adataStarmap.to_csv(result_path,index = None)
```
Zip the csv file with the tissue image, StarmapVR can visualize the spatial trancriptomic data in spatial dimensions. An example can be found in /Convert from Scanpy or Seurat/Convert from Scanpy (spatial).ipynb .The csv file and zip file should add ".sql" before the file extention. The example data can be found in /sampleData/humanlymphnode_4096_data.sql.zip.
## Visualisation of Image cytometry data
For image cytometry data with actual cell image, user can zip their cell images(cell index as the image name) with the requiring csv file, the csv file and zip file should add ".qpi" before the file extention. An example file can be found in /sampleData/Multi-ATOM_105kimage_data.qpi.zip.

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
