module.exports = function(err,req,res,next){
    console.log(err);
    res.status(500).json({
        type: "Something Went Wrong",
        msg: err
    })
}