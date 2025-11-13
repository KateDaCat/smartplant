USE sarawak_plant_db;
SELECT * FROM species;
-- Update all the species with proper information
UPDATE species SET 
    scientific_name = 'Acacia auriculiformis',
    common_name = 'Earleaf Acacia',
    is_endangered = 0,
    description = 'Fast-growing evergreen tree with distinctive "ear-shaped" pods. Widely planted for erosion control and as ornamental tree in tropical regions'
WHERE species_id = 1;

UPDATE species SET 
    scientific_name = 'Acacia mangium',
    common_name = 'Brown Salwood',
    is_endangered = 0,
    description = 'Fast-growing, medium-to-large tropical tree, brown salwood is highly valued for its durable timber, pulp production, and ability to rehabilitate degraded lands due to its nitrogen-fixing properties'
WHERE species_id = 2;

UPDATE species SET 
    scientific_name = 'Alocasia longiloba',
    common_name = 'Tiger Taro',
    is_endangered = 1,
    description = 'Large tropical plant known for its striking, arrow-shaped leaves, which feature dark green blades, contrasting pale veins, and a deep purple underside'
WHERE species_id = 3;

UPDATE species SET 
    scientific_name = 'Alocasia macrorrhizos',
    common_name = 'Giant Taro', 
    is_endangered = 1,
    description = 'Large evergreen perennial herb that can grow up to 4 meters tall with large, upright, arrowhead-shape leaves and long petioles, native to rainforest'
WHERE species_id = 4;

UPDATE species SET 
    scientific_name = 'Casuarina equisetifolia',
    common_name = 'Coastal She-oak',
    is_endangered = 1,
    description = 'Fast-growing evergreen tree with fine, drooping branchlets which look like needles, commonly planted in coastal areas for windbreaks and erosion control'
WHERE species_id = 5; 

UPDATE species SET 
    scientific_name = 'Cerbera manghas',
    common_name = 'Sea Mango',
    is_endangered = 0,
    description = 'A highly poisonous evergreen coastal tree characterized by glossy leaves, fragrant white flowers, and distinctive, buoyant red fruits that facilitate its water dispersal across tropical coastlines'
WHERE species_id = 6;

UPDATE species SET 
    scientific_name = 'Crotalaria pallida',
    common_name = 'Smooth Rattlepod',
    is_endangered = 0,
    description = 'Herbaceous plant with yellow flowers and inflated seed pods that rattle when dry. Often used as green manure in agriculture.'
WHERE species_id = 7; 

UPDATE species SET 
    scientific_name = 'Morinda citrifolia',
    common_name = 'Noni',
    is_endangered = 0,
    description = 'Tropical evergreen tree known for its yellow-white fruit, traditionally used in herbal medicine'
WHERE species_id = 8;

UPDATE species SET 
    scientific_name = 'Neolamarckia cadamba',
    common_name = 'Burflower-tree',
    is_endangered = 0,
    description = 'A fast-growing tropical tree known for its fragrant, spherical flower clusters and uses in timber and traditional medicine'
WHERE species_id = 9;

UPDATE species SET 
    scientific_name = 'Oldenlandia corymbosa',
    common_name = 'Flat-Top Mille Graines',
    is_endangered = 0,
    description = 'Small annual herb with white flowers, used in traditional medicine for fever and liver disorders in various Asian cultures.'
WHERE species_id = 10;

UPDATE species SET 
    scientific_name = 'Peperomia pellucida',
    common_name = 'Shiny Bush',
    is_endangered = 0,
    description = 'Small herbaceous plant with translucent leaves and succulent stems. Used in traditional medicine for arthritis and as a vegetable in salads'
WHERE species_id = 11;

UPDATE species SET 
    scientific_name = 'Phyllanthus amarus',
    common_name = 'Stonebreaker',
    is_endangered = 0,
    description = 'Small medicinal herb traditionally used for kidney stones and liver disorders. It is identified by seeds hanging beneath the leaves'
WHERE species_id = 12;

SELECT species_id, scientific_name, common_name 
FROM species 
WHERE species_id BETWEEN 1 AND 12 
ORDER BY species_id;




