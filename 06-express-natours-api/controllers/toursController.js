const Tour = require("../models/tourModel");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync")

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
}
exports.getAllTours = catchAsync(async (req, res,next) => {
 
  
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate()
    
    //ExECUTE QUERY
    const tours = await features.query;
    

    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours
      }
    })

  });

exports.getTour = catchAsync(async (req, res,next) => {
 
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({ _id: req.params.id })
     if (!tour) {
    return next(new AppError("No tour found with that ID", 404));
  }
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
 
});

exports.updateTour = catchAsync(async(req, res,next) => {

  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators:true
  })
 if (!tour) {
    return next(new AppError("No tour found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      tour
    }
  }) 
});

exports.deleteTour = catchAsync(async (req, res,next )=> {
  
  const tour = await Tour.findByIdAndDelete(req.params.id);
   if (!tour) {
    return next(new AppError("No tour found with that ID", 404));
  }

    res.status(204).json({
      status: "success",
      data: null,
    });
  
});


exports.createTour = catchAsync(async (req, res,next) => {
  
    
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
    
  
});






exports.getTourStats = catchAsync(async (req, res,next) => {
  
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: "$difficulty" },
          numTours: { $sum: 1 },
          numRatings: { $sum: "$ratingsQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
      // {
      //   $match: { _id: { $ne: 'EASY' } }
      // }
    ]);

    res.status(200).json({
      status: "success",
      data: {
        stats,
      },
    });
 
});

exports.getMonthlyPlan = catchAsync(async (req, res,next) => {
  
    const year = req.params.year * 1; // 2021

    const plan = await Tour.aggregate([
      {
        $unwind: "$startDates",
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numTourStarts: { $sum: 1 },
          tours: { $push: "$name" },
        },
      },
      {
        $addFields: { month: "$_id" },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { numTourStarts: -1 },
      },
      {
        $limit: 12,
      },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        plan,
      },
    });
  
});
























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
