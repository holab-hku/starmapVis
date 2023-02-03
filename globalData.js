let globalData = {
    cellData: null,
    cellData3D: null,
    cellData3D2: null,
    cellData3DPosBuffer: null,
    cellData3D2PosBuffer: null,
    trajectoryData: null,
    curUsingColormap: [],
    scaleUp: 0,
    scaleDown: 0,
    showData: true,
    showCompass: true,
    showTrajectory: true,
    showColormap: true,
    showLinkage: false,
    showLinkage2: false,
    hasInputPath: true,
    visModeList: ['Default', 'High-Quality'],
    curVisMode: { Mode: 'Default' },
    markerGeneList: [],
    curMarkerGene: { Attribute: '' },
    categoricalColorDict: {},
    featureMAX: 0,
    featureMIN: 0,
    // for the movement
    destinationCheckpoint: {},
    doTheMovement: false,

    justLiftUp: false,

    curAnimationPath: {},
    sampleAnimationPath: {
        s1: {
            Path_1: 'Y_80 Y_70 Y_13 Y_16 Y_57 Y_28 Y_33 Y_48 Y_12 Y_36 Y_76 Y_61 Y_49 Y_40 Y_43 Y_52 Y_71 Y_53 Y_85 Y_3',
            Path_2: 'Y_80 Y_70 Y_13 Y_16 Y_57 Y_28 Y_33 Y_48 Y_12 Y_36 Y_76 Y_61 Y_49 Y_40 Y_43 Y_52 Y_71 Y_53 Y_75 Y_55 Y_50 Y_20 Y_39 Y_66 Y_8',
            Path_3: 'Y_80 Y_70 Y_13 Y_16 Y_57 Y_28 Y_33 Y_48 Y_12 Y_36 Y_76 Y_61 Y_49 Y_40 Y_43 Y_52 Y_71 Y_53 Y_75 Y_55 Y_50 Y_20 Y_35 Y_58 Y_56 Y_31 Y_9 Y_4 Y_10 Y_64 Y_54 Y_21',
            Path_4: 'Y_80 Y_1 Y_29 Y_60 Y_5 Y_46 Y_77 Y_63 Y_74 Y_14 Y_78 Y_18 Y_69 Y_47 Y_68 Y_79 Y_2 Y_27 Y_45 Y_11 Y_32 Y_73 Y_44 Y_38 Y_62 Y_81 Y_51 Y_67 Y_42 Y_34 Y_41 Y_83 Y_7 Y_72 Y_23',
        },
        s2: {
            Path_1: 'Y5 Y14 Y11 Y15 Y16 Y12 Y9 Y10 Y13',
            Path_2: 'Y5 Y6 Y3 Y2 Y17 Y1 Y8',
        },
        s3: {
            Path_1: 'Slice1 Slice2 Slice1 Slice2 Slice1 Slice2',
        },
        s4: {
            Path_1: 'Slice1 Slice2 Slice3 Slice4 Slice1 Slice2 Slice3 Slice4',
        }
    },
    lapPath: {
        s1: ['0 0 250', '250 0 250', '250 0 0', '250 0 -250', '0 0 -250', '-250 0 -250', '-250 0 0', '-250 0 250'],
        s2: ['0 75 250', '200 75 250', '200 75 0', '200 75 -250', '0 75 -250', '-100 75 -250', '-100 75 0', '-100 75 250'],
    },
    mcCounter: 0,
    mcLenOfPathList: 0,
    onMovement: false,
    startFrom2D: false,
    showImg: true,
    idStr: '',
    idStrTra: '',
    inputFile1: false,
    inputFile1Trans: false,
    inputFile1Trans2: false,
    inputFile2: false,
    inputPath: false,
    inputSlice: false,
    stopAnimation: false,
    trajRootId: '',
    numOfSlices: 0,
    s3Trans2: false,
    curStatus: 0,

    colormapList: ['Batlow', 'Turbo', 'Viridis'],
    curColormap: { Colourmap: 'Batlow' },
    colormapInfo: {
        'Batlow': {
            num: 100,
            path: 'packages/batlow100.txt',
            imgPath: 'image/batlowweb.png'
        },
        'Turbo': {
            num: 257,
            path: 'packages/turbo.txt',
            imgPath: 'image/turboImg.png'
        },
        'Viridis': {
            num: 257,
            path: 'packages/viridis.txt',
            imgPath: 'image/viridisImg.png'
        },
    },

    isStr: false,
    groupRenderPos: null,
    groupRenderColor: null,

    stopMoveBtn: false,
    imagePositionCache: {},
};
