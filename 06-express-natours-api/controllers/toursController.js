const Tour = require("../models/tourModel");


exports.getAllTours = (req, res) => {
 
};

exports.getTour = (req, res) => {

};

exports.updateTour = (req, res) => {

};

exports.deleteTour = (req, res) => {

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