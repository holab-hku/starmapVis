library(dplyr)
library(Seurat)
library(patchwork)

# Load the PBMC dataset
pbmc.data <- Read10X(data.dir = "filtered_gene_bc_matrices/hg19/")
# Initialize the Seurat object with the raw (non-normalized data).
pbmc <- CreateSeuratObject(counts = pbmc.data, project = "pbmc3k", min.cells = 3, min.features = 200)
pbmc

# The [[ operator can add columns to object metadata. This is a great place to stash QC stats
pbmc[["percent.mt"]] <- PercentageFeatureSet(pbmc, pattern = "^MT-")

pbmc <- subset(pbmc, subset = nFeature_RNA > 200 & nFeature_RNA < 2500 & percent.mt < 5)

pbmc <- NormalizeData(pbmc, normalization.method = "LogNormalize", scale.factor = 10000)

pbmc <- NormalizeData(pbmc)

pbmc <- FindVariableFeatures(pbmc, selection.method = "vst", nfeatures = 2000)

all.genes <- rownames(pbmc)
pbmc <- ScaleData(pbmc, features = all.genes)

pbmc <- RunPCA(pbmc, features = VariableFeatures(object = pbmc))

# Examine and visualize PCA results a few different ways
print(pbmc[["pca"]], dims = 1:5, nfeatures = 5)


pbmc <- FindNeighbors(pbmc, dims = 1:10)
pbmc <- FindClusters(pbmc, resolution = 0.5)

head(Idents(pbmc), 5)

pbmc <- RunUMAP(pbmc, dims = 1:10)

DimPlot(pbmc, reduction = "umap")

saveRDS(pbmc, file = "filtered_gene_bc_matrices/output/pbmc_tutorial.rds")

pbmc <- readRDS(file = "filtered_gene_bc_matrices/output/pbmc_tutorial.rds")

pca_data <- pbmc[['pca']]@cell.embeddings
pca_data <- data.frame(pca_data)

pca_3d <- pca_data %>% select(1,2,3)
names(pca_3d)[1] <- "x"
names(pca_3d)[2] <- "y"
names(pca_3d)[3] <- "z"

feature_data <- pca_data %>% select(1:10)

cluster <- Idents(pbmc)
cluster <- data.frame(cluster)

pbmc_starmap <- bind_cols(pca_3d, feature_data)
pbmc_starmap <- bind_cols(pbmc_starmap, cluster)

write.csv(pbmc_starmap,"filtered_gene_bc_matrices/output/pbmc_starmap.csv",row.names=F)
