const os=require('os');

module.exports.getOsInformation=async(req,res)=>{
    try{
        res.status(200).json({});
    }catch(error){
        res.status(500).json({message:error.message});
    }
}