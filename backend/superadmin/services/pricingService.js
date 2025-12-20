const { PricingRule, PricingHistory } = require('../models');

async function list(){ return await PricingRule.findAll(); }

async function create(payload, user){
  const rule = await PricingRule.create(payload);
  // record initial history
  await PricingHistory.create({ ruleId: rule.id, oldPrice: 0, newPrice: payload.config?.basePrice || 0, changedBy: user.id, reason: 'created' });
  return rule;
}

async function history(){ return await PricingHistory.findAll({ order: [['createdAt','DESC']] }); }

module.exports = { list, create, history };
