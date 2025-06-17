import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Award, Gift, BarChart, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

import AddTierModal from "./AddTierModal";
import EditTierModal from "./EditTierModal";
import AddRewardModal from "./AddRewardModal";
import EditRewardModal from "./EditRewardModal";
import ConfirmDeleteModal from "../Common/ConfirmDeleteModal";
import LoyaltyReports from "./LoyaltyReports";

import * as loyaltyService from '@/services/loyaltyService';
import { LoyaltyTier, LoyaltyReward, LoyaltySettings } from '@/services/loyaltyService';

const LoyaltyManagementContent = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  // State for data
  const [loyaltyTiers, setLoyaltyTiers] = useState<LoyaltyTier[]>([]);
  const [loyaltyRewards, setLoyaltyRewards] = useState<LoyaltyReward[]>([]);
  const [settings, setSettings] = useState<LoyaltySettings | null>(null);

  // State for UI
  const [isLoadingTiers, setIsLoadingTiers] = useState(true);
  const [isLoadingRewards, setIsLoadingRewards] = useState(true);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Fetch tiers from API
  const fetchTiers = async () => {
    try {
      setIsLoadingTiers(true);
      const data = await loyaltyService.getAllTiers();
      setLoyaltyTiers(data);
    } catch (error) {
      console.error('Error fetching loyalty tiers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch loyalty tiers",
        variant: "destructive",
      });
    } finally {
      setIsLoadingTiers(false);
    }
  };

  // Fetch rewards from API
  const fetchRewards = async () => {
    try {
      setIsLoadingRewards(true);
      const data = await loyaltyService.getAllRewards();
      setLoyaltyRewards(data);
    } catch (error) {
      console.error('Error fetching loyalty rewards:', error);
      toast({
        title: "Error",
        description: "Failed to fetch loyalty rewards",
        variant: "destructive",
      });
    } finally {
      setIsLoadingRewards(false);
    }
  };

  // Fetch settings from API
  const fetchSettings = async () => {
    try {
      setIsLoadingSettings(true);
      const data = await loyaltyService.getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching loyalty settings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch loyalty settings",
        variant: "destructive",
      });
    } finally {
      setIsLoadingSettings(false);
    }
  };

  // Load all data on component mount
  useEffect(() => {
    fetchTiers();
    fetchRewards();
    fetchSettings();
  }, []);

  const handleAddTier = async (newTier: Omit<LoyaltyTier, '_id'>) => {
    try {
      const addedTier = await loyaltyService.createTier(newTier);
      setLoyaltyTiers([...loyaltyTiers, addedTier]);
      toast({
        title: "Tier added",
        description: `${newTier.name} tier has been added successfully.`,
      });
    } catch (error) {
      console.error('Error adding tier:', error);
      toast({
        title: "Error",
        description: "Failed to add tier",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTier = async (id: string, updatedTier: Partial<LoyaltyTier>) => {
    try {
      const updated = await loyaltyService.updateTier(id, updatedTier);
      setLoyaltyTiers(
        loyaltyTiers.map(tier =>
          tier._id === id ? { ...tier, ...updated } : tier
        )
      );
      toast({
        title: "Tier updated",
        description: `Tier has been updated successfully.`,
      });
    } catch (error) {
      console.error('Error updating tier:', error);
      toast({
        title: "Error",
        description: "Failed to update tier",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTier = async (id: string) => {
    try {
      await loyaltyService.deleteTier(id);
      setLoyaltyTiers(loyaltyTiers.filter(tier => tier._id !== id));
      toast({
        title: "Tier deleted",
        description: "The tier has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting tier:', error);
      toast({
        title: "Error",
        description: "Failed to delete tier",
        variant: "destructive",
      });
    }
  };

  const handleAddReward = async (newReward: Omit<LoyaltyReward, '_id'>) => {
    try {
      const addedReward = await loyaltyService.createReward(newReward);
      setLoyaltyRewards([...loyaltyRewards, addedReward]);
      toast({
        title: "Reward added",
        description: `${newReward.name} reward has been added successfully.`,
      });
    } catch (error) {
      console.error('Error adding reward:', error);
      toast({
        title: "Error",
        description: "Failed to add reward",
        variant: "destructive",
      });
    }
  };

  const handleUpdateReward = async (id: string, updatedReward: Partial<LoyaltyReward>) => {
    try {
      const updated = await loyaltyService.updateReward(id, updatedReward);
      setLoyaltyRewards(
        loyaltyRewards.map(reward =>
          reward._id === id ? { ...reward, ...updated } : reward
        )
      );
      toast({
        title: "Reward updated",
        description: `Reward has been updated successfully.`,
      });
    } catch (error) {
      console.error('Error updating reward:', error);
      toast({
        title: "Error",
        description: "Failed to update reward",
        variant: "destructive",
      });
    }
  };

  const handleDeleteReward = async (id: string) => {
    try {
      await loyaltyService.deleteReward(id);
      setLoyaltyRewards(loyaltyRewards.filter(reward => reward._id !== id));
      toast({
        title: "Reward deleted",
        description: "The reward has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting reward:', error);
      toast({
        title: "Error",
        description: "Failed to delete reward",
        variant: "destructive",
      });
    }
  };

  const handleSaveSettings = async () => {
    if (!settings) return;

    try {
      setIsSavingSettings(true);
      const updatedSettings = await loyaltyService.updateSettings({
        pointsExpiration: Number(settings.pointsExpiration),
        pointsPerDollar: Number(settings.pointsPerDollar),
        welcomeBonus: Number(settings.welcomeBonus),
        birthdayBonus: Number(settings.birthdayBonus),
        promoCodesApplicable: typeof settings.promoCodesApplicable === 'boolean'
          ? settings.promoCodesApplicable
          : settings.promoCodesApplicable === 'yes',
        discountAvailable: typeof settings.discountAvailable === 'boolean'
          ? settings.discountAvailable
          : settings.discountAvailable === 'yes'
      });

      setSettings(updatedSettings);
      toast({
        title: "Settings saved",
        description: "Loyalty program settings have been updated successfully.",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setIsSavingSettings(false);
    }
  };

  const filteredRewards = loyaltyRewards.filter(reward =>
    reward.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reward.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reward.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Loyalty Program Management</h1>
      </div>

      <Tabs defaultValue="tiers" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="tiers" className="flex items-center gap-2">
            <Award size={16} />
            <span>Loyalty Tiers</span>
          </TabsTrigger>
          <TabsTrigger value="rewards" className="flex items-center gap-2">
            <Gift size={16} />
            <span>Rewards</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <BarChart size={16} />
            <span>Reports</span>
          </TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="tiers">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Loyalty Tiers</CardTitle>
              <AddTierModal onAddTier={handleAddTier} />
            </CardHeader>
            <CardContent>
              {isLoadingTiers ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Loading tiers...</span>
                </div>
              ) : loyaltyTiers.length > 0 ? (
                <div className="space-y-6">
                  {loyaltyTiers.map((tier) => (
                    <div key={tier._id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full"
                            style={{ backgroundColor: tier.color.startsWith('#') ? tier.color : '#6d4c41' }}
                          ></div>
                          <h3 className="text-lg font-semibold">{tier.name}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <EditTierModal
                            tier={tier}
                            onUpdateTier={(updatedTier) => handleUpdateTier(tier._id, updatedTier)}
                          />
                          <ConfirmDeleteModal
                            itemName={tier.name}
                            onConfirmDelete={() => handleDeleteTier(tier._id)}
                            buttonVariant="outline"
                          />
                        </div>
                      </div>
                      <div className="mb-3">
                        <span className="text-sm text-gray-500">Points Required:</span>
                        <span className="ml-2 font-medium">{tier.pointsRequired.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 mb-2 block">Benefits:</span>
                        <ul className="list-disc list-inside space-y-1">
                          {tier.benefits.map((benefit, index) => (
                            <li key={index} className="text-sm">{benefit}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No loyalty tiers found. Add your first tier to get started.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Rewards</CardTitle>
              <AddRewardModal onAddReward={handleAddReward} />
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="text"
                    placeholder="Search rewards..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {isLoadingRewards ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Loading rewards...</span>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Reward Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Points Cost</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRewards.length > 0 ? (
                        filteredRewards.map((reward) => (
                          <TableRow key={reward._id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{reward.name}</p>
                                <p className="text-sm text-gray-500">{reward.description}</p>
                              </div>
                            </TableCell>
                            <TableCell>{reward.category}</TableCell>
                            <TableCell>{reward.pointsCost.toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge variant={reward.status === "Active" ? "default" : "secondary"}>
                                {reward.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <EditRewardModal
                                  reward={reward}
                                  onUpdateReward={(updatedReward) => handleUpdateReward(reward._id, updatedReward)}
                                />
                                <ConfirmDeleteModal
                                  itemName={reward.name}
                                  onConfirmDelete={() => handleDeleteReward(reward._id)}
                                />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                            No rewards found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <LoyaltyReports />
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Loyalty Program Settings</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingSettings ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Loading settings...</span>
                </div>
              ) : settings ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Points Expiration (months)</label>
                      <Input
                        type="number"
                        value={settings.pointsExpiration}
                        onChange={(e) => setSettings({ ...settings, pointsExpiration: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Points per $1 Spent</label>
                      <Input
                        type="number"
                        value={settings.pointsPerDollar}
                        onChange={(e) => setSettings({ ...settings, pointsPerDollar: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Welcome Bonus Points</label>
                      <Input
                        type="number"
                        value={settings.welcomeBonus}
                        onChange={(e) => setSettings({ ...settings, welcomeBonus: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Birthday Bonus Points</label>
                      <Input
                        type="number"
                        value={settings.birthdayBonus}
                        onChange={(e) => setSettings({ ...settings, birthdayBonus: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Promo Codes Applicable</label>
                      <Select
                        value={settings.promoCodesApplicable ? "yes" : "no"}
                        onValueChange={(value) => setSettings({ ...settings, promoCodesApplicable: value === "yes" })}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes - Promo codes can be used with loyalty benefits</SelectItem>
                          <SelectItem value="no">No - Promo codes cannot be used with loyalty benefits</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500 mt-1">
                        {settings.promoCodesApplicable
                          ? "Customers can use promo codes alongside their loyalty program benefits."
                          : "Customers must choose between using a promo code or their loyalty program benefits."}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Discount Available</label>
                      <Select
                        value={settings.discountAvailable ? "yes" : "no"}
                        onValueChange={(value) => setSettings({ ...settings, discountAvailable: value === "yes" })}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes - Discount codes can be used with loyalty benefits</SelectItem>
                          <SelectItem value="no">No - Discount codes can not be used with loyalty benefits</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500 mt-1">
                        {settings.discountAvailable
                          ? "Customers can use discount codes alongside their loyalty program benefits."
                          : "Customers must choose between using a discount code or their loyalty program benefits."}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-4">
                    <Button
                      variant="outline"
                      onClick={fetchSettings}
                      disabled={isSavingSettings}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveSettings}
                      disabled={isSavingSettings}
                    >
                      {isSavingSettings ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : "Save Changes"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Failed to load settings. Please try again.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LoyaltyManagementContent;
