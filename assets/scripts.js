var timer = new Timer();

function toggle_menu(e){
  var menu = document.getElementById("menu");
  if (menu.classList.contains("hidden")) {
    menu.classList.remove("hidden");
  } else {
    menu.classList.add("hidden");
  }
}

// Setup buttons
document.getElementById("toggle_menu").addEventListener('click', toggle_menu);
document.getElementById("toggle_timer_state").addEventListener('click', function(e){
  timer.toggle_timer_state();
});
document.getElementById("reset_last").addEventListener('click', function(e){
  timer.reset_last();
});
document.getElementById("save_state").addEventListener('click', function(e){
  timer.save_state();
});
document.getElementById("buzzer_toggle").addEventListener('change', function(e){
  timer.toggle_buzzer();
});
// Setup time change buttons
document.querySelectorAll(".js_change_time").forEach(function(btn){
  btn.addEventListener('click', function(e){
    timer.change_time(parseInt(e.currentTarget.getAttribute("data-time-increment")), true);
  });
});
// Setup set time buttons
document.querySelectorAll(".js_set_time").forEach(function(btn){
  btn.addEventListener('click', function(e){
    timer.set_time(parseInt(e.currentTarget.getAttribute("data-time")));
  });
});

document.addEventListener('keypress', function(e){
  //console.log(e.keyCode);
  //console.log(e.key);
  if (document.activeElement) {
    document.activeElement.blur();
  }
  //spacebar = play/pause
  if (e.keyCode == 32 || (e.key && e.key == ' ')) {
    timer.toggle_timer_state();
  }

  //s = save
  if (e.keyCode == 115 || (e.key && e.key == 's')) {
    timer.save_state();
  }

  //r = reset
  if (e.keyCode == 114 || (e.key && e.key == 'r')) {
    timer.reset_last();
  }

  // Set timer to 0
  if (e.keyCode == 48 || (e.key && e.key == '0')) {
    timer.set_time(0);
  }
  // Set timer to 2:45
  if (e.keyCode == 49 || (e.key && e.key == '1')) {
    timer.set_time(165);
  }
  // Set timer to 7:00
  if (e.keyCode == 50 || (e.key && e.key == '2')) {
    timer.set_time(420);
  }
  // Set timer to 15:00
  if (e.keyCode == 51 || (e.key && e.key == '3')) {
    timer.set_time(900);
  }

  // add 1
  if (e.keyCode == 51 || (e.key && e.key == '=')) {
    timer.change_time(1);
  }
  // remove 1
  if (e.keyCode == 51 || (e.key && e.key == '-')) {
    timer.change_time(-1);
  }
  // add 10
  if (e.keyCode == 51 || (e.key && e.key == '+')) {
    timer.change_time(10);
  }
  // remove 10
  if (e.keyCode == 51 || (e.key && e.key == '_')) {
    timer.change_time(-10);
  }

  // menu toggle
  if (e.keyCode == 109 || (e.key && e.key == 'm')) {
    toggle_menu();
  }
  if (e.keyCode == 98 || (e.key && e.key == 'b')) {
    timer.toggle_buzzer();
  }
});

// The main timer
function Timer(){
  // The timer interval
  this.timer = null,
  // The current time in seconds
  this.time = 0,
  // The last saved state
  this.last_state = null,
  // Is the timer running
  this.running = false,
  // Play a buzzer sound when time reaches 0
  this.buzzer_enabled = true,
  // Initialize the timer and its buttons
  this.init = function(){
    this.set_time(0);
    this.toggle_state_button(false);
  },
  this.toggle_timer_state = function(){
    if (this.running) {
      this.stop();
    } else {
      this.start();
    }
  },
  // Start the timer
  this.start = function(){
    if (!this.running && this.time > 0) {
      this.set_timer();
      this.running = true;
      var timer_state_display = document.getElementById("toggle_timer_state");
      if (!timer_state_display.classList.contains('running')) {
        timer_state_display.classList.add('running');
      }
    }
  },
  // Stop the timer
  this.stop = function(){
    if (this.time) {
      clearInterval(this.timer);
    }
    this.timer = null;
    this.running = false;
    var timer_state_display = document.getElementById("toggle_timer_state");
    if (timer_state_display.classList.contains('running')) {
      timer_state_display.classList.remove('running');
    }
  },
  this.toggle_buzzer = function(){
    this.buzzer_enabled = !this.buzzer_enabled;
    document.getElementById('buzzer_toggle').checked = this.buzzer_enabled;
  },
  // Save the current state
  this.save_state = function(){
    this.last_state = this.time;

    var [minutes, seconds] = this.calculate_time(this.last_state);
    document.getElementById("last_state_display").innerHTML = "" + minutes + ":" + seconds;
    this.toggle_state_button(true);
  },
  // Reset to the last saved state
  this.reset_last = function(){
    if (this.last_state !== null) {
      this.stop();
      this.time = this.last_state;
      this.display_time();
    }
  },
  // Toggle display for the state button
  this.toggle_state_button = function(state = null){
    var reset_last_btn = document.getElementById("reset_last");
    if (state !== null) {
      if (state === true && reset_last_btn.classList.contains("hidden")) {
        reset_last_btn.classList.remove("hidden");
      }
      if (state === false && !reset_last_btn.classList.contains("hidden")) {
        reset_last_btn.classList.add("hidden");
      }
    } else {
      if (reset_last_btn.classList.contains("hidden")) {
        reset_last_btn.classList.remove("hidden");
      } else {
        reset_last_btn.classList.add("hidden");
      }
    }
  },
  // Change the time
  this.change_time = function(time_increment = 0, stop_timer = false){
    this.time += time_increment;
    if (this.time < 0) {
      this.time = 0;
    }
    this.display_time();
    if (stop_timer) {
      this.stop();
    }
  },
  // Set the time and stop the timer
  this.set_time = function(time_to_set = 0){
    this.stop();
    this.time = time_to_set;
    this.display_time();
  },
  // Calculate the time to display
  this.calculate_time = function(time_seconds){
    minutes = parseInt(time_seconds / 60, 10);
    seconds = parseInt(time_seconds % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return [minutes, seconds]
  },
  // Display the calculated time
  this.display_time = function(){
    var [minutes, seconds] = this.calculate_time(this.time);
    document.getElementById("timer_display").innerHTML = "" + minutes + ":" + seconds
  },
  // Set the timer interval
  this.set_timer = function(){
    timer_obj = this;
    this.timer = setInterval(function(){
      timer_obj.update();
    }, 1000)
  }
  // Update the current time and stop if time's out
  this.update = function(){
    this.change_time(-1, false);
    if (this.time <= 0) {
      clearInterval(this.timer);
      this.stop();

      if(this.buzzer_enabled){
        // Play audio buzzer
        var audio = new Audio('assets/sounds/buzzer.mp3');
        audio.play();
      }
    }
  }
  ;
  this.init();
  return this;
}

function ColorModeManager(){
  this.state = 'dark';
  this.init = function(){
    this.state = 'dark';
    this.change_state(this.state);
    this.bind_buttons();
  }
  this.change_state = function(newState){
    this.state = newState;
    document.body.classList = [];
    document.body.classList.add("color_mode__" + this.state);
  };
  this.bind_buttons = function (){
    let color_mode_buttons = document.querySelectorAll(".js_color_mode_button");
    if(color_mode_buttons){
      color_mode_buttons.forEach(function(element,k){
        element.addEventListener("click", function(e){
          console.log(e.currentTarget.dataset.colorMode);
          colorCodeManager.change_state(e.currentTarget.dataset.colorMode);
        });
      });
    }
  }
  this.init();
  return this;
}

const colorCodeManager = new ColorModeManager();