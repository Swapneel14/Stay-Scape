const Listing= require("../models/listing.js");
const Review = require("../models/review.js");


module.exports.index=async (req,res)=>{
   const alllist= await Listing.find({});
   res.render("listings/index.ejs",{alllist});
}

module.exports.filter=async(req,res)=>{
  const alllist=await Listing.find({categories:req.params.cat});
  res.render("listings/index.ejs",{alllist});
}

module.exports.rendernewform=(req,res)=>{
  res.render("listings/new.ejs", {
    categories: Listing.schema.path("categories").caster.enumValues
  });
}

module.exports.showlising=async (req,res)=>{
    let {id}=req.params;
    const list=await Listing.findById(id)
    .populate({path:"reviews",
      populate:{
        path:"author"
      }
    }

    )
    .populate("owner");
    if(!list){
      req.flash('error','No Such Resort is there');
      return res.redirect("/listing");
    }
    console.log(list);
    res.render("listings/show.ejs",{list});
}

module.exports.createlisting=async(req,res,next)=>{
       const newlist=new Listing(req.body.newlist);
       let categories = req.body.categories;

    // Make sure it's always an array
       if (!Array.isArray(categories)) {
      categories = [categories]; // wrap single value in array
       }
      
       newlist.owner=req.user._id;
       if(req.file){
         newlist.image.url=req.file.path;
         newlist.image.filename=req.file.filename;
       }
       newlist.categories=categories;
       
       await newlist.save();
       req.flash("success","New Listing Created!");
       res.redirect("/listing");
      
}

module.exports.rendereditform= async(req,res)=>{
    let {id}=req.params;
    const list=await Listing.findById(id);
    if(!list){
      req.flash('error','No Such Resort is there');
      return res.redirect("/listing");
    }

    let url=list.image.url;
    let newurl=url.replace('/upload','/upload/w_250')
    
    res.render("listings/edit.ejs",{list,newurl});
    }

module.exports.editlisting=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);

    if(!listing.owner._id.equals(req.user._id)){
      req.flash('error','You dont have permission to Edit');
      return res.redirect(`/listing/${id}`);
    }
    
    let list=await Listing.findByIdAndUpdate(id,{...req.body.newlist});
    if(req.file){
      let url=req.file.path;
    let filename=req.file.filename;
    list.image.url=url;
    list.image.filename=filename;
    await list.save();

    }

   req.flash("success","Edited Successfully");
   res.redirect(`/listing/${id}`);
    }

module.exports.deleteListing= async(req,res)=>{
     let {id}=req.params;
     await Listing.findByIdAndDelete(id);
     req.flash("success","Deleted Successfully");
     res.redirect("/listing");
    }