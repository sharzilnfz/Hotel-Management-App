import express from 'express';
import {
    getAllTiers,
    getTierById,
    createTier,
    updateTier,
    deleteTier
} from '../../controllers/loyalty/tier.controller.js';

import {
    getAllRewards,
    getRewardById,
    createReward,
    updateReward,
    deleteReward
} from '../../controllers/loyalty/reward.controller.js';

import {
    getSettings,
    updateSettings
} from '../../controllers/loyalty/settings.controller.js';

const router = express.Router();

// Tier routes
router.get('/tiers', getAllTiers);
router.get('/tiers/:id', getTierById);
router.post('/tiers', createTier);
router.put('/tiers/:id', updateTier);
router.delete('/tiers/:id', deleteTier);

// Reward routes
router.get('/rewards', getAllRewards);
router.get('/rewards/:id', getRewardById);
router.post('/rewards', createReward);
router.put('/rewards/:id', updateReward);
router.delete('/rewards/:id', deleteReward);

// Settings routes
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

export default router; 