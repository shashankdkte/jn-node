const Tour = require("../models/tourModel");


exports.getAllTours = async (req, res) => {
 
  try
  {
    //BUILD QUERY
    const queryObj = { ...req.query };
    
    //EXTERNAL FUNCTIONALITY
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach(el => delete queryObj[el]);


    // 2 ) ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    

    let query = Tour.find(JSON.parse(queryStr));

    //SORTING

    if (req.query.sort)
    {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    }
    else
    {
      query = query.sort("-createdAt");
    }
    
    //LIMIT 
    if (req.query.fields)
    {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    }
    else
    {
      query = query.select("-__v");
    }

    // const query = Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy')


    //PAGINATION
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);
    if (req.query.page)
    {
      const numOfTours = await Tour.countDocuments();
      if(skip >= numOfTours) throw new Error("This page not exist")
      }
    //ExECUTE QUERY
    const tours = await query;
    

    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours
      }
    })

  } catch (error) {
    res.status(404).json({
      status: "fail",
      message:error
    })
  }

};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({ _id: req.params.id })

    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateTour = async(req, res) => {
try {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators:true
  })

  res.status(200).json({
    status: "success",
    data: {
      tour
    }
  })
} catch (error) {
   res.status(404).json({
      status: "fail",
      message: err,
    });
}
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};


exports.createTour = async (req, res) => {
  try
  {
    
    // const newTour = new Tour({});
    // newTour.save()
    //Another way of creating document

    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        tour:newTour
      }
    })
    
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message:error
    })
  }
  
};































// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price)
//   {
//     return res.status(400).json({
//       status: "fail",
//       message:"Missing name or price"
//     })
//   }
//   next();
// }
// const fs = require('fs');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkID = (req, res, next, val) => {
//   // console.log(`Tour id is ${val}`);
//   // if (req.params.id * 1 > tours.length)
//   // {
//   //   return res.status(404).json({
//   //     status: "fail",
//   //     message:"Invalid ID"
//   //   })
//   // }
//   next()
// }

// exports.getAllTours = (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     requestedAt: req.requestTime,
//     results: tours.length,
//     data: tours,
//   });
// };

// exports.getTour = (req, res) => {
//   const { id } = req.params;

//   const tour = tours.find((x) => x.id === +id);
//   if (!tour) {
//     return res.status(404).json({
//       status: 'fail',
//     });
//   }
//   res.status(200).json({
//     status: 'success',
//     tour: tour,
//   });
// };
// exports.updateTour = (req, res) => {
//   const { id } = req.params;
//   const updatedTour = req.body;

//   const tour = tours.find((x) => x.id === +id);
//   if (!tour) {
//     return res.status(404).json({
//       status: 'fail',
//     });
//   }
//   res.status(200).json({
//     status: 'success',
//     tour: updatedTour,
//   });
// };

// exports.deleteTour = (req, res) => {
//   const { id } = req.params;

//   const tour = tours.find((x) => x.id === +id);
//   if (!tour) {
//     return res.status(404).json({
//       status: 'fail',
//     });
//   }
//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// };


// exports.createTour = (req, res) => {
//   const newId = tours[tours.length - 1].id + 1;
//   const newTour = Object.assign({ id: newId }, req.body);
//   tours.push(newTour);
//   fs.writeFile(
//     `${__dirname}/dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     (err) => {
//       res.status(201).json({
//         status: 'success',
//         data: newTour,
//       });
//     }
//   );
// };
