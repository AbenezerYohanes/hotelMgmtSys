const pricingService = require('../services/pricingService');

async function list(req,res,next){ try{ res.json(await pricingService.list()); }catch(err){next(err);} }
async function create(req,res,next){ try{ res.status(201).json(await pricingService.create(req.body, req.user)); }catch(err){next(err);} }
async function history(req,res,next){ try{ res.json(await pricingService.history()); }catch(err){next(err);} }

module.exports = { list, create, history };
