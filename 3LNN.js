//CONTROL VARIABLES/////
//Input vector
var inputVector = [1,1,2,1,1,2,1,1];

//Vector the AI is training to match
var targetVector = [.5,0,0,0,0,0,0,0];

//Hyperparameters
var learningFactor = .325;
var percentUpdated = .0075;

//Loop iterations
var runs = 800;
////////////////////////


//Matrix generator that randomizes all cells
function create0Matrix(diameter){
    var matrix = [];

    for (let i = 0; i < diameter; i++) {
        matrix[i] = [];
        for(let k = 0; k < diameter; k++) {
            matrix[i][k] = Math.random() - .5;
        }
      }
    return matrix;
}

//Matrix generator that zeroes all cells
function createZMatrix(diameter){
    var matrix = [];

    for (let i = 0; i < diameter; i++) {
        matrix[i] = [];
        for(let k = 0; k < diameter; k++) {
            matrix[i][k] = 0;
        }
      }
    return matrix;
}

//Matrix Multiplies Input Vector by Weight Matrix and Applies Standard Tanh Activation Function
function matrixMultiply(inputV, weightM, diam){
    var outputVector = [];
    for(let i = 0; i < diam; i++){
        var sum = 0;
        for(let k = 0; k < diam; k++){
            sum = sum + (inputV[k] * weightM[i][k]);
        }
        outputVector[i] = Math.tanh(sum);
    }

    return outputVector;
}

function randomlyUpdateWeights(weights, diam){
    var weightMatrix = createZMatrix(diam);
    for(let i = 0; i < diam; i++){
        for(let k = 0; k < diam; k++){
            if(Math.random() > 1 - percentUpdated){
                weightMatrix[i][k] = weights[i][k] * (learningFactor + 1);
            }else{
                weightMatrix[i][k] = weights[i][k];
            }
            if(Math.random() < percentUpdated){
                weightMatrix[i][k] = weights[i][k] * (1 - learningFactor);
            }else{
                weightMatrix[i][k] = weights[i][k];
            }
        }
    }
    return weightMatrix;
}

//New randomized square weight matrix
let weightMatrix1 = create0Matrix(8);
let weightMatrix2 = create0Matrix(8);
let weightMatrix3 = create0Matrix(8);

let transformedVector = [];
let transformedVectorTemp = [];

for(let i = 0; i < runs; i++){
    var errorInitial = 0;
    var tempError = 0;
    var finalError = 0;

    transformedVector = matrixMultiply(matrixMultiply(matrixMultiply(inputVector, weightMatrix1, inputVector.length),weightMatrix2,inputVector.length),weightMatrix3,inputVector.length);

    for(let k = 0; k < inputVector.length; k++){
        errorInitial = errorInitial + ((Math.pow((targetVector[k] - transformedVector[k]),2))/2);
    }

    let tempWeights1 = randomlyUpdateWeights(weightMatrix1, inputVector.length);
    let tempWeights2 = randomlyUpdateWeights(weightMatrix2, inputVector.length);
    let tempWeights3 = randomlyUpdateWeights(weightMatrix3, inputVector.length);

    transformedVectorTemp = matrixMultiply(matrixMultiply(matrixMultiply(inputVector, tempWeights1, inputVector.length),tempWeights2,inputVector.length),tempWeights3,inputVector.length);

    for(let j = 0; j < inputVector.length; j++){
        tempError = tempError + ((Math.pow((targetVector[j] - transformedVectorTemp[j]),2))/2);
    }

    if(tempError < errorInitial){
        weightMatrix1 = tempWeights1;
        weightMatrix2 = tempWeights2;
        weightMatrix3 = tempWeights3;
    }

    transformedVector = matrixMultiply(matrixMultiply(matrixMultiply(inputVector, weightMatrix1, inputVector.length),weightMatrix2,inputVector.length),weightMatrix3,inputVector.length);

    for(let m = 0; m < inputVector.length; m++){
        finalError = finalError + ((Math.pow((targetVector[m] - transformedVector[m]),2))/2);
    }

    console.log("Error: "+finalError.toExponential());
}
console.log("");
console.log("targ:"+targetVector);
console.log("outp:"+transformedVector);
