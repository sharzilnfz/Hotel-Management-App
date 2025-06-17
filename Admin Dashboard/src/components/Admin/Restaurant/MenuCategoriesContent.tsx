import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpDown, Plus, Edit, Trash2, Search, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// Interface for menu categories
interface MenuCategory {
  _id: string;
  name: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Interface for form data
interface CategoryFormData {
  name: string;
  description: string;
  isActive: boolean;
}

const MENU_CATEGORIES_ENDPOINT = "http://localhost:4000/api/restaurant/menu-categories";

const MenuCategoriesContent: React.FC = () => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
    isActive: true
  });

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      console.log("Fetching categories from:", MENU_CATEGORIES_ENDPOINT);
      const response = await axios.get(MENU_CATEGORIES_ENDPOINT);
      console.log("Categories API Response:", response.data);

      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setCategories(response.data.data);
      } else if (response.data && Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        console.error("Unexpected API response format:", response.data);
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories: " + (error instanceof Error ? error.message : String(error)));
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Load categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter categories based on search query and status
  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          category.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
                          (statusFilter === "active" && category.isActive) ||
                          (statusFilter === "inactive" && !category.isActive);
    
    return matchesSearch && matchesStatus;
  });

  // Reset form data
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      isActive: true
    });
  };

  // Handle opening add modal
  const handleAddCategory = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  // Handle opening edit modal
  const handleEditCategory = (category: MenuCategory) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      isActive: category.isActive
    });
    setIsEditModalOpen(true);
  };

  // Handle opening delete modal
  const handleDeleteCategory = (category: MenuCategory) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  // Handle form submission for add/edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setIsSubmitting(true);
      
      if (isEditModalOpen && selectedCategory) {
        // Update existing category - keep existing sort order
        const updateData = {
          ...formData,
          sortOrder: selectedCategory.sortOrder
        };
        await axios.put(`${MENU_CATEGORIES_ENDPOINT}/${selectedCategory._id}`, updateData);
        toast.success("Category updated successfully");
        setIsEditModalOpen(false);
      } else {
        // Create new category - auto-calculate sort order
        const maxSortOrder = categories.length > 0 ? Math.max(...categories.map(c => c.sortOrder)) : 0;
        const createData = {
          ...formData,
          sortOrder: maxSortOrder + 1
        };
        await axios.post(MENU_CATEGORIES_ENDPOINT, createData);
        toast.success("Category created successfully");
        setIsAddModalOpen(false);
      }
      
      // Refresh categories list
      fetchCategories();
      resetForm();
      setSelectedCategory(null);
    } catch (error) {
      console.error("Error saving category:", error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Failed to save category");
      } else {
        toast.error("An error occurred while saving the category");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!selectedCategory) return;

    try {
      setIsSubmitting(true);
      await axios.delete(`${MENU_CATEGORIES_ENDPOINT}/${selectedCategory._id}`);
      toast.success("Category deleted successfully");
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Failed to delete category");
      } else {
        toast.error("An error occurred while deleting the category");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle category status
  const toggleCategoryStatus = async (category: MenuCategory) => {
    try {
      const updatedData = { ...category, isActive: !category.isActive };
      await axios.put(`${MENU_CATEGORIES_ENDPOINT}/${category._id}`, {
        name: updatedData.name,
        description: updatedData.description,
        sortOrder: updatedData.sortOrder,
        isActive: updatedData.isActive
      });
      toast.success(`Category ${updatedData.isActive ? 'activated' : 'deactivated'} successfully`);
      fetchCategories();
    } catch (error) {
      console.error("Error updating category status:", error);
      toast.error("Failed to update category status");
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Menu Categories</h2>
        <Button onClick={handleAddCategory}>
          <Plus className="mr-2 h-4 w-4" /> Add New Category
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" onClick={resetFilters}>
          Reset Filters
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Categories ({filteredCategories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
              <span>Loading categories...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <div className="flex items-center">
                      Name
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      {categories.length === 0 ? "No categories found. Add your first category!" : "No categories match your search criteria"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories
                    .sort((a, b) => a.sortOrder - b.sortOrder)
                    .map((category) => (
                      <TableRow key={category._id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell className="max-w-[300px] truncate">{category.description}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              category.isActive 
                                ? "bg-green-100 text-green-800" 
                                : "bg-red-100 text-red-800"
                            }`}>
                              {category.isActive ? "Active" : "Inactive"}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleCategoryStatus(category)}
                              className="h-6 w-6 p-0"
                            >
                              {category.isActive ? (
                                <EyeOff className="h-3 w-3" />
                              ) : (
                                <Eye className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(category.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEditCategory(category)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDeleteCategory(category)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Category Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a new menu category. Categories help organize your menu items.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="col-span-3"
                  placeholder="e.g., Appetizers"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="col-span-3"
                  placeholder="Brief description of the category"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isActive" className="text-right">
                  Active
                </Label>
                <div className="col-span-3">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsAddModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Category"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Category Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the category information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name *
                </Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="col-span-3"
                  placeholder="e.g., Appetizers"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="col-span-3"
                  placeholder="Brief description of the category"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-isActive" className="text-right">
                  Active
                </Label>
                <div className="col-span-3">
                  <Switch
                    id="edit-isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Category"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Category Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the category "{selectedCategory?.name}"? 
              This action cannot be undone and will only work if no menu items are using this category.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Category"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MenuCategoriesContent; 