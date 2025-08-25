
const userImages =require('../modals/userImages');

const displayUserImages = async (req, res) => {
    console.log("display Images")
   try {
    const auth_id = req.params.id;
   const operations = await userImages.find({ auth_id });
  //  console.log(auth_id);
  //  console.log(operations);
  const operationsWithUrl = operations.map(op => ({
    _id: op._id,
    auth_id: op.auth_id,
    operation: op.operation,
    url: op.fileUrl,  // ✅ Directly use Cloudinary URL
    createdAt: op.createdAt
  }));
  // console.log(operationsWithUrl);
  res.json(operationsWithUrl);
  
  } catch (err) {
    console.log("error in calling display user images", err);
    res.status(500).json({ error: 'Failed to fetch user operations' });
  }
}

module.exports=displayUserImages;