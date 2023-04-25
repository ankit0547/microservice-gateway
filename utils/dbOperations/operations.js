exports.getAllDocumentsByCollection = async (col) => {
  try {
    const documents = await col.find();
    return documents;
    //   return response.succesResponse(res, 200, allUsers);
  } catch (err) {
    logger.error(err);
    return response.errorResponse(res, 422, err.message);
  }
};

exports.createDocumentByCollection = async (col, data) => {
  try {
    const createdDocument = await col.create(data);
    return createdDocument;
    //   return response.succesResponse(res, 200, allUsers);
  } catch (err) {
    logger.error(err);
    return response.errorResponse(res, 422, err.message);
  }
};
