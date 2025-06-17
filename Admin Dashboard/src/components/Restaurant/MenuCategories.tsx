
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MenuItem from "./MenuItem";

const MenuCategories = () => {
  const [activeCategory, setActiveCategory] = useState("breakfast");
  
  // In a real app, this would be fetched from an API
  const menuItems = {
    breakfast: [
      {
        id: "b1",
        name: "Continental Breakfast",
        description: "A selection of pastries, fresh fruit, yogurt, and coffee or tea.",
        price: 18,
        imageUrl: "https://images.unsplash.com/photo-1533920379810-6bedac961555?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "b2",
        name: "Eggs Benedict",
        description: "Poached eggs with hollandaise sauce on English muffin with ham or smoked salmon.",
        price: 22,
        imageUrl: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "b3",
        name: "Belgian Waffles",
        description: "Served with whipped cream, fresh berries, and maple syrup.",
        price: 16,
        imageUrl: "https://images.unsplash.com/photo-1562376552-0d160a2f35ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      }
    ],
    lunch: [
      {
        id: "l1",
        name: "Caesar Salad",
        description: "Romaine lettuce, croutons, parmesan cheese, and Caesar dressing.",
        price: 14,
        imageUrl: "https://images.unsplash.com/photo-1599021419847-d8a7a6aba5b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "l2",
        name: "Club Sandwich",
        description: "Triple-decker sandwich with turkey, bacon, lettuce, tomato, and mayo.",
        price: 16,
        imageUrl: "https://images.unsplash.com/photo-1528736235302-52922df5c122?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "l3",
        name: "Pasta Primavera",
        description: "Fresh seasonal vegetables in a light cream sauce over linguine.",
        price: 19,
        imageUrl: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      }
    ],
    dinner: [
      {
        id: "d1",
        name: "Filet Mignon",
        description: "8oz filet with red wine reduction, served with mashed potatoes and asparagus.",
        price: 38,
        imageUrl: "https://images.unsplash.com/photo-1558030006-450675393462?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "d2",
        name: "Grilled Salmon",
        description: "Fresh Atlantic salmon with lemon butter sauce, served with wild rice and seasonal vegetables.",
        price: 28,
        imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "d3",
        name: "Vegetable Risotto",
        description: "Creamy arborio rice with roasted vegetables and parmesan cheese.",
        price: 24,
        imageUrl: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      }
    ],
    dessert: [
      {
        id: "ds1",
        name: "Chocolate Lava Cake",
        description: "Warm chocolate cake with a molten center, served with vanilla ice cream.",
        price: 12,
        imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "ds2",
        name: "New York Cheesecake",
        description: "Classic cheesecake with graham cracker crust and berry compote.",
        price: 10,
        imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "ds3",
        name: "Crème Brûlée",
        description: "Rich custard topped with a layer of caramelized sugar.",
        price: 11,
        imageUrl: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      }
    ]
  };

  return (
    <div className="pb-6">
      <Tabs defaultValue={activeCategory} onValueChange={setActiveCategory}>
        <div className="mb-4">
          <TabsList className="w-full bg-gray-100">
            <TabsTrigger value="breakfast" className="flex-1">Breakfast</TabsTrigger>
            <TabsTrigger value="lunch" className="flex-1">Lunch</TabsTrigger>
            <TabsTrigger value="dinner" className="flex-1">Dinner</TabsTrigger>
            <TabsTrigger value="dessert" className="flex-1">Dessert</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="breakfast" className="space-y-6">
          {menuItems.breakfast.map(item => (
            <MenuItem
              key={item.id}
              id={item.id}
              name={item.name}
              description={item.description}
              price={item.price}
              imageUrl={item.imageUrl}
            />
          ))}
        </TabsContent>
        
        <TabsContent value="lunch" className="space-y-6">
          {menuItems.lunch.map(item => (
            <MenuItem
              key={item.id}
              id={item.id}
              name={item.name}
              description={item.description}
              price={item.price}
              imageUrl={item.imageUrl}
            />
          ))}
        </TabsContent>
        
        <TabsContent value="dinner" className="space-y-6">
          {menuItems.dinner.map(item => (
            <MenuItem
              key={item.id}
              id={item.id}
              name={item.name}
              description={item.description}
              price={item.price}
              imageUrl={item.imageUrl}
            />
          ))}
        </TabsContent>
        
        <TabsContent value="dessert" className="space-y-6">
          {menuItems.dessert.map(item => (
            <MenuItem
              key={item.id}
              id={item.id}
              name={item.name}
              description={item.description}
              price={item.price}
              imageUrl={item.imageUrl}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MenuCategories;
