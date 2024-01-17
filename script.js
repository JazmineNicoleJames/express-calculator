const ExpressError = require('./expressError')
const express = require('express')
const app = express()
app.use(express.json())

function calculateMeanMedianMode(nums) {
    let sum = 0;
    let counts = {};

    for(let i=0; i < nums.length; i++) {
        if(isNaN(nums[i])){
            throw new ExpressError(`${nums[i]} is not a number.`,400)
        };

        sum += nums[i];

        counts[nums[i]] = (counts[nums[i]] || 0) + 1;
    };

    const mean = sum / nums.length;

    const sortedNums = nums.slice().sort((a, b) => a - b);
    let median;

    if(sortedNums.length % 2 === 0){
        const middleNum1 = sortedNums[sortedNums.length / 2 - 1];
        const middleNum2 = sortedNums[sortedNums.length / 2];
        median = (middleNum1 + middleNum2);
    } else {
        median = sortedNums[Math.floor(sortedNums.length /2)];
    }

    let mode;
    let maxCount = 0;

    for(const num in counts){
        if(counts[num] > maxCount) {
            mode = parseFloat(num);
            maxCount = counts[num];
        }
    }

    return { mean, median, mode }

}

app.get('/mean', (req, res) => {
    const numsStr = req.query.nums;
    const nums = numsStr.split(',').map(num => {
        parsedNum = parseFloat(num);
        return isNaN(parsedNum) ? num : parsedNum 
    }); 

    const { mean } = calculateMeanMedianMode(nums);
    console.log({mean})

    res.json({
        operation: 'mean',
        value: mean 
    });
});


app.get('/median', (req,res) => {
    const numsStr = req.query.nums;

    const nums = numsStr.split(',').map(num => {
        parsedNum = parseFloat(num);
        return isNaN(parsedNum) ? num : parsedNum 
    }); 

    const { median } = calculateMeanMedianMode(nums);

    res.json({
        operation: 'median',
        value: median 
    });
});


app.get('/mode', (req, res) => {
    const numsStr = req.query.nums;
    const nums = numsStr.split(',').map(num => parseFloat(num));

    const { mode } = calculateMeanMedianMode(nums);

    res.json({
        operation: 'mode',
        value: mode
    });
});

app.get('/all', (req, res) => {
    const numsStr = req.query.nums;
    const nums = numsStr.split(',').map(num => parseFloat(num));

    const { mean } = calculateMeanMedianMode(nums);
    const { median } = calculateMeanMedianMode(nums);
    const { mode } = calculateMeanMedianMode(nums);


    res.json({
        operation: 'all',
        mean: mean,
        median: median, 
        mode: mode
    })
})


app.use((error, req, res, next) => {
    let status = error.status;
    let message = error.message;
    res.status(status).json({ error: {message, status}})
})


app.listen(3000, function() {
    console.log('port 3000')
})