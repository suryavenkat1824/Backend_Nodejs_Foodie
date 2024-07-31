const Firm=require('../models/Firm')
const Vendor=require('../models/Vendor')
const multer=require('multer')
const path=require('path')

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Directory to save the uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Append file extension
    }
});

const upload= multer({storage: storage})


const addFirm=async(req,res)=>{
    try {
        const {firmName,area,category,region,offer} =req.body
    
    const image=req.file ? req.file.filename:undefined;
    const vendor=await Vendor.findById(req.vendorId)
    if(!vendor)
    {
        res.status(404).json({message:"Vendor Not Found"})
    }
    if(vendor.firm.length>0){
        return res.status(400).json({message:"vendor can only have one firm"});
       }
    const firm = new Firm(
        {
            firmName,area,category,region,offer,image,vendor:vendor._id
        }
    )
   const savedFirm= await firm.save();
   const firmId=savedFirm._id;
   
   vendor.firm.push(savedFirm)
  
   await vendor.save();
   
  
    return res.status(200).json({message:"Firm Added Successfully",firmId})

    } catch (error) {
        console.error(error)
        res.status(500).json("internal server error")
    }
    
}

const deleteFirmById=async(req,res)=>{
    try {
        const firmId=req.params.firmId;
        const deletedFirm=await Firm.findByIdAndDelete(firmId);
        if(!deletedFirm)
        {
            return res.status(404).json({error:"No Firm found"})
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({error:"Internal server error"})
    }
}
module.exports ={addFirm: [upload.single('image'),addFirm],deleteFirmById}