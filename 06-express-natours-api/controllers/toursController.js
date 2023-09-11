const Tour = require("../models/tourModel");
const APIFeatures = require("../utils/apiFeatures")
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
}
exports.getAllTours = async (req, res) => {
 
  try
  {
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
