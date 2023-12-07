const fs = require("fs");

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  return res.status(200).json({
    status: "success",
    result: tours.length,
    data: { tours },
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { id: newId, ...req.body };
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (error) => {
      return res.status(200).json({
        status: "success",
        data: { tour: newTour },
      });
    }
  );
};

const getTour = (req, res) => {
  const id = parseInt(req.params.tourId);
  const tour = tours.find((t) => t.id === parseInt(id));
  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Tour not found",
    });
  }
  return res.status(200).json({
    status: "success",
    data: { tour },
  });
};

const updateTour = (req, res) => {
  const id = parseInt(req.params.tourId);
  const tour = tours.find((t) => t.id === parseInt(id));
  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Tour not found",
    });
  }
  const index = tours.findIndex((t) => t.id === parseInt(id));
  tours[index] = { ...tour, ...req.body };
};

const deleteTour = (req, res) => {
  const id = parseInt(req.params.tourId);
  const tour = tours.find((t) => t.id === parseInt(id));
  tours = tours.filter((t) => t.id !== id);
  return res.status(204).json({
    status: "success",
    data: null,
  });
};

module.exports = {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
};
