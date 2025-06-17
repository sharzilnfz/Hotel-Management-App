import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";

interface Category {
  _id: string;
  name: string;
  description: string;
  serviceCount: number;
  status: string;
}

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  status: z.string().default("active")
});

const SpaCategoriesContent = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "active"
    }
  });

  // Fetch categories from API
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:4000/api/categories");
      if (response.data.success) {
        setCategories(response.data.data);
      } else {
        toast.error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize with data from API
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("http://localhost:4000/api/categories", data);

      if (response.data.success) {
        toast.success("Category created successfully");
        fetchCategories(); // Refresh the categories list
        form.reset();
        setCreateDialogOpen(false); // Close the dialog after successful creation
      } else {
        toast.error(response.data.message || "Failed to create category");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error(error.response?.data?.message || "Failed to create category");
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    form.reset({
      name: category.name,
      description: category.description,
      status: category.status
    });
  };

  const handleUpdate = async (data: z.infer<typeof formSchema>) => {
    if (!editingCategory) return;

    try {
      const response = await axios.put(
        `http://localhost:4000/api/categories/${editingCategory._id}`,
        data
      );

      if (response.data.success) {
        toast.success("Category updated successfully");
        fetchCategories(); // Refresh the categories list
        setEditingCategory(null);
        form.reset();
      } else {
        toast.error(response.data.message || "Failed to update category");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error(error.response?.data?.message || "Failed to update category");
    }
  };

  const confirmDelete = (id: string) => {
    setCategoryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    try {
      const response = await axios.delete(`http://localhost:4000/api/categories/${categoryToDelete}`);

      if (response.data.success) {
        toast.success("Category deleted successfully");
        fetchCategories(); // Refresh the categories list
      } else {
        toast.error(response.data.message || "Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      // Check if the error is due to category being used by services
      if (error.response?.data?.serviceCount) {
        toast.error(`Cannot delete category that is associated with ${error.response.data.serviceCount} services`);
      } else {
        toast.error(error.response?.data?.message || "Failed to delete category");
      }
    } finally {
      setCategoryToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  // Seed initial categories
  const handleSeedInitialCategories = async () => {
    if (categories.length > 0) {
      toast.info("Categories already exist");
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/api/categories/seed");

      if (response.data.success) {
        toast.success(`${response.data.count} categories seeded successfully`);
        fetchCategories(); // Refresh the categories list
      } else {
        toast.error(response.data.message || "Failed to seed categories");
      }
    } catch (error) {
      console.error("Error seeding categories:", error);
      toast.error(error.response?.data?.message || "Failed to seed categories");
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.serviceCount.toString().includes(searchQuery) ||
    category.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Spa Categories</h1>
        <div className="flex gap-2">
          {categories.length === 0 && (
            <Button onClick={handleSeedInitialCategories} variant="outline" className="flex items-center gap-2">
              <Plus size={16} />
              <span>Seed Initial Categories</span>
            </Button>
          )}
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2" onClick={() => setCreateDialogOpen(true)}>
                <Plus size={16} />
                <span>Add Category</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter category name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter category description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button variant="outline" type="button" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
                    <Button type="submit">Create Category</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  type="text"
                  placeholder="Search categories..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Services Count</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10">
                        Loading categories...
                      </TableCell>
                    </TableRow>
                  ) : filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => (
                      <TableRow key={category._id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>{category.description}</TableCell>
                        <TableCell>{category.serviceCount}</TableCell>
                        <TableCell>
                          <Badge variant={category.status === "active" ? "default" : "outline"}>
                            {category.status === "active" ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(category)}>
                                  <Edit size={16} />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Category</DialogTitle>
                                </DialogHeader>
                                <Form {...form}>
                                  <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-4">
                                    <FormField
                                      control={form.control}
                                      name="name"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Category Name</FormLabel>
                                          <FormControl>
                                            <Input placeholder="Enter category name" {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={form.control}
                                      name="description"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Description</FormLabel>
                                          <FormControl>
                                            <Textarea placeholder="Enter category description" {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <DialogFooter>
                                      <DialogClose asChild>
                                        <Button variant="outline" type="button">Cancel</Button>
                                      </DialogClose>
                                      <Button type="submit">Update Category</Button>
                                    </DialogFooter>
                                  </form>
                                </Form>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => confirmDelete(category._id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                        No categories found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this category? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SpaCategoriesContent;
