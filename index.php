<!DOCTYPE html>

<title>Bored?</title>

<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"> 


<body>

    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
<style>
    body {
        margin: 0;
        background: black
    }
</style>


<div class="fixed bg-white">
    <div class="fixed text-white text-lg ml-2 mt-1 select-none">
        <span>[Score: </span><span id="scoreID">0</span>] 
        <span>[Destroyed: </span><span id="killID">0</span>]
    </div>
</div>


<div class="fixed inset-0 flex items-center justify-center mb-100 " id="modalEL">
    <div class="bg-white max-w-md w-full p-6 text-center  rounded-lg">
        <h1 class="text-4xl font-bold leading-none" id="endScore">0</h1>
        <p class="text-sm text-gray-700 mb-4">Points</p>
        <h1 class="text-4xl font-bold leading-none" id="endScoreEnemies">0</h1>
        <p class="text-sm text-gray-700 mb-4">Enemies Destroyed</p>

        <div><button class="bg-blue-500 text-white w-full py-3 rounded-full" id="startGameBtn">Start Game</button></div>
    </div>
</div>
<canvas></canvas>

</body>


<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.7/gsap.min.js" integrity="sha512-f6bQMg6nkSRw/xfHw5BCbISe/dJjXrVGfz9BSDwhZtiErHwk7ifbmBEtF9vFW8UNIQPhV2uEFVyI/UHob9r7Cw==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script src="./index.js"></script>
