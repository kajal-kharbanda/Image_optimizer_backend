
const userImages =require('../modals/userImages');

const displayUserImages = async (req, res) => {
    console.log("display Images")
   try {
    const auth_id = req.params.id;
    const operations = await userImages.find({ auth_id });
const operationsWithUrl = operations.map(op => ({
  ...op,
  url: `http://localhost:3000/${op.filename}`,
   // or cloud URL
   operation: `${op.operation}`
}));
res.json(operationsWithUrl);
  } catch (err) {
    console.log("error in calling display user images", err);
    res.status(500).json({ error: 'Failed to fetch user operations' });
  }
}

module.exports=displayUserImages;