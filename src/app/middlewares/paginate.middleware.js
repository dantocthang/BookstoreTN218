
import { PER_PAGE } from "../../config/pagination.js";

export default function paginate(Model) {

    return async (req, res, next) => {

        try {
            const currentPage = parseInt(req.query.page || 1);
        
            const model = await Model.findAndCountAll({
                include: { all: true },
                offset: (currentPage - 1) * PER_PAGE,
                limit: PER_PAGE,
            });
            
            const numberOfRecords = model.count;
            const numberOfPages = Math.ceil(numberOfRecords / PER_PAGE);
            if (currentPage > numberOfPages && numberOfPages > 0) {
                return res.redirect(`${req.originalUrl.split('?')[0]}`);
            }
        
            const startIndex = (currentPage - 1) * PER_PAGE + 1;
            let endIndex = startIndex + PER_PAGE - 1;
            if (endIndex > numberOfRecords) {
                endIndex = numberOfRecords;
            }
    
            res.paginatedResult = {
                model: model.rows,
                numberOfPages,
                startIndex,
                endIndex,
                numberOfRecords,
                currentPage,
            }

            next();
    
        } catch(error) {
            throw new Error(error);
        }
    
    }
    
}