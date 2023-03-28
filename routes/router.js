const express = require("express");
const modelLab = require("../models/lab_model");

const router = express.Router();

const Lab = modelLab.LabModel;

var page = 1;

// #READ
//          http://localhost:3000/labs/list/:page
router.get("/list/:page", async (req, res, next) => {
  try {
    //  get all labs
    const labs = await Lab.find({}).lean().exec();
    //  get all pages
    const pageCount = Number.isInteger(labs.length / 3)
      ? labs.length / 3
      : Math.floor(labs.length / 3 + 1);
    let pages = [];
    for (let i = 1; i <= pageCount; i++) {
      pages.push(i);
    }
    //  get present page
    page = parseInt(req.params.page);
    if (page > pageCount) {
      page = pageCount;
    }
    // split pages
    /*
                first   >   page    >   end
                not         active      not
        */
    let indexToSplit = pages.indexOf(page);
    let first = pages.slice(0, indexToSplit);
    let end = pages.slice(indexToSplit + 1);
    console.log(`${first}>${page}>${end}`);

    const labsPage = await Lab.find({})
      .limit(3)
      .skip(3 * (page - 1))
      .lean()
      .exec();

    //  render
    return res.render("home", {
      pageTitle: `Labs - Page ${page}`,
      labsPage: labsPage,
      first: first,
      page: page,
      end: end,
      disablePrev: page == 1,
      disableNext: page === pageCount,
      count: labsPage.length,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// #CREATE
//          http://localhost:3000/labs/create
router.get("/create", (req, res, next) => {
  res.render("create", {
    pageTitle: "Add new Lab",
    page: page,
  });
});

router.post("/create", async (req, res, next) => {
  console.log("req.body", req.body);

  try {
    const lab = await Lab.create({
      title: req.body.title,
      content: req.body.content,
      docs: req.body.docs == "" ? 0 : req.body.docs,
    });

    return res.redirect("/labs/list/" + page);
  } catch (error) {
    res.status(500).send(error);
  }
});

// #UPDATE
//          http://localhost:3000/labs/update/:_id
router.get("/update/:_id", async (req, res, next) => {
  try {
    const lab = await Lab.findById(req.params._id).lean().exec();

    return res.render("update", {
      pageTitle: "Update Lab",
      page: page,
      lab: lab,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/update/:_id", async (req, res, next) => {
  try {
    const lab = await Lab.findByIdAndUpdate(req.params._id, {
      title: req.body.title,
      content: req.body.content,
      docs: req.body.docs == "" ? 0 : req.body.docs,
    });

    return res.redirect("/labs/list/" + page);
  } catch (error) {
    res.status(500).send(error);
  }
});

// #DELETE
//          http://localhost:3000/labs/delete/:_id
router.get("/delete/:_id", async (req, res, next) => {
  try {
    const lab = await Lab.findByIdAndDelete(req.params._id).lean().exec();

    return res.redirect("/labs/list/" + page);
  } catch (error) {
    res.status(500).send(error);
  }
});

// #QUERY
// #View a detail Item
//          http://localhost:3000/labs/view/:_id
router.get("/detail/:_id", async (req, res, next) => {
  try {
    const lab = await Lab.findById(req.params._id).lean().exec();

    return res.render("detail", {
      pageTitle: "Detail Lab",
      lab: lab,
      page: page,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// #Search
//          http://localhost:3000/labs/list_search
router.post("/list_search", async (req, res, next) => {
  console.log("req.body", req.body);

  if (
    req.body.title === "" &&
    req.body.content === "" &&
    req.body.docs === ""
  ) {
    return res.redirect("/labs/list/" + page);
  }

  try {
    const labsSearch = await Lab.find({
      title: {
        $regex: req.body.title,
        $options: "i",
      },
      content: {
        $regex: req.body.content,
        $options: "i",
      },
      docs: req.body.docs === "" ? { $gte: 0 } : { $eq: req.body.docs },
    })
      .lean()
      .exec();

    //  render
    return res.render("home", {
      pageTitle: `Search`,
      labsPage: labsSearch,
      isSearch:true
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

exports.router = router;
