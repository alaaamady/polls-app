# Votify App
## Introduction
###  This repository contains the source code for a react app that provides access to a voting system's various features. The website can be accessed at  [This Link](https://polls-app-alaaamady.vercel.app/)

### Installation
1. Clone the repository

    git clone https://github.com/alaaamady/polls-app.git

2. Install dependencies

     yarn

3. Create a `.env` with the following variable

    REACT_APP_API_URL=https://polls-api-production.up.railway.app
 
 

or you can use the local API URL

4. Start the app

    yarn start

## Design Decisions

 - The `Ant Design` system was used as building blocks for the app's components for it's fully fledged library and wide range of functionality
 - `Typescript` was used for a type safe development

## Project structure
The app is divides into two separate entities:

 - /pages
	 - Includes components for the app's router pages, in this case the HomePage, and a NotFoundPage for unregistered routes
 - /components
	 - Includes reusable element that can be reused in both different components and pages, such as `PollCardChoices.tsx` and `PollCardModal.tsx`

## To be improvised

 - [ ] Create `jest` test cases for components
 - [ ]  Create a `theme.ts` to unify the apps design
