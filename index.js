const express = require('express')
const app = express()

const { initializeDataBase } = require('./db/db.connect')

const Recipe = require('./models/recipe.models')

app.use(express.json())

initializeDataBase()

async function createRecipe(newRecipe) {
    try {
        const recipe = new Recipe(newRecipe)
        const saveRecipe = await recipe.save()
        return saveRecipe
    } catch (error) {
        throw error
    }
}

app.post('/recipes', async (req, res) => {
    try {
        const savedRecipe = await createRecipe(req.body)
        res.status(201).json({ message: 'Recipe added successfully' })
    } catch {
        res.status(500).json({ error: 'Failed to add recipe' })
    }
})

//------- Get all the recipes -----------//

async function getAllRecipes() {
    try {
        const allRecipes = await Recipe.find()
        return allRecipes
    } catch (error) {
        throw error
    }
}

app.get('/recipes', async (req, res) => {
    try {
        const recipes = await getAllRecipes()
        if (recipes.length !== 0) {
            res.json(recipes)
        } else {
            res.status(404).json({ error: 'No recipes were found.' })
        }
    } catch (error) {
        res.status(500).json({ errro: 'Faield to fetch the recipes data' })
    }
})

// Get recipes by title //

async function getRecipeByTitle(recipeName) {
    try {
        const recipeByName = await Recipe.findOne({ title: recipeName })
        return recipeByName
    } catch (error) {
        console.log('Error:', error)
    }
}

app.get('/recipe/by-recipe/:recipeName', async (req, res) => {
    try {
        const recipes = await getRecipeByTitle(req.params.recipeName)
        if (recipes) {
            res.json(recipes)
        } else {
            res.status(404).json({ error: 'No recipe found' })
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to find recipe.' })
    }
})

// get recipe by author //

async function getRecipeByAuthorName(authorName) {
    try {
        const recipebyAuthorName = await Recipe.findOne({ author: authorName })
        return recipebyAuthorName
    } catch (error) {
        console.log('Error:', error)
    }
}

app.get('/recipes/by-authorName/:authorName', async (req, res) => {
    try {
        const recipes = await getRecipeByAuthorName(req.params.authorName)
        if (recipes) {
            res.json(recipes)
        } else {
            res.status(404).json({ error: 'No recipe found' })
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to find recipe.' })
    }
})

// get recipy of easy difficulty level //

async function getRecipeByDifficultyLevel(difficulty) {
    try {
        const recipebyDifficultyLevel = await Recipe.findOne({ difficulty: difficulty })
        return recipebyDifficultyLevel
    } catch (error) {
        console.log('Error:', error)
    }
}

app.get('/recipes/by-difficulty/:difficulty', async (req, res) => {
    try {
        const recipes = await getRecipeByDifficultyLevel(req.params.difficulty)
        if (recipes) {
            res.json(recipes)
        } else {
            res.status(404).json({ error: 'No recipe found' })
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to find recipe.' })
    }
})

// Update a recipe difficulty by id //


async function updateRecipeById(recipeId, dataToUpdate) {
    try {
        const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, dataToUpdate, {
            new: true
        })
        return updatedRecipe
    } catch (error) {
        console.log('Recipe does not exist')
    }
}

app.post('/recipes/:recipeId', async (req, res) => {
    try {
        const updatedRecipe = await updateRecipeById(req.params.recipeId, req.body)
        if (updatedRecipe) {
            res.status(200).json({ message: 'Recipe updated successfully', updatedRecipe: updatedRecipe })
        } else {
            res.status(404).json({ error: 'Recipe not found' })
        }

    } catch (error) {
        res.status(500).json({ error: 'Failed to update Recipe' })
    }
})


// update the recipe data with title //

async function updateRecipeByTitle(recipeTitle, dataToUpdate) {
    try {
        const updatedRecipe = await Recipe.findOneAndUpdate({ title: recipeTitle }, dataToUpdate, {
            new: true
        })
        return updatedRecipe
    } catch (error) {
        console.log('Recipe does not exist')
    }
}

app.post('/recipes/by-title/:recipeTitle', async (req, res) => {
    try {
        const updatedRecipe = await updateRecipeByTitle(req.params.recipeTitle, req.body)
        if (updatedRecipe) {
            res.status(200).json({ message: 'Recipe updated successfully', updatedRecipe: updatedRecipe })
        } else {
            res.status(404).json({ error: 'Recipe not found' })
        }

    } catch (error) {
        res.status(500).json({ error: 'Failed to update Recipe' })
    }
})

// delete the recipe by recipeId //

async function deleteRecipe(recipeId) {
    try {
        const deletedRecipe = await Recipe.findByIdAndDelete(recipeId)
        return deletedRecipe
    } catch (error) {
        console.log(error)
    }
}

app.delete('/recipes/:recipeId', async (req, res) => {
    try {
        const deletedRecipe = await deleteRecipe(req.params.recipeId)
        if (deletedRecipe) {
            res.status(200).json({ message: "Recipe deleted successfully." })
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete Recipe' })
    }
})








const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})