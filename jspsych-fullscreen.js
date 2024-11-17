/* jspsych-survey-fullscreen.js
 * Combined plugin for survey form and fullscreen functionality
 */

jsPsych.plugins['survey-fullscreen'] = (function() {
  var plugin = {};

  plugin.info = {
    name: 'survey-fullscreen',
    description: 'Combined survey form and fullscreen functionality',
    parameters: {
      preamble: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Preamble',
        default: '',
        description: 'HTML formatted string to display at the top of the page.'
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default: 'Jätka',
        description: 'Label of the button.'
      },
      delay_after: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Delay after',
        default: 1000,
        description: 'Delay after entering fullscreen before ending the trial.'
      },
      fullscreen_mode: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Fullscreen mode',
        default: true,
        description: 'If true, enter fullscreen mode. If false, exit fullscreen mode.'
      }
    }
  };

  // Store event listeners for cleanup
  var fullscreenChangeListener = null;
  var keydownListener = null;
  var popstateListener = null;

  plugin.trial = function(display_element, trial) {
    // Check if keys are allowed in fullscreen mode
    var keyboardNotAllowed = typeof Element !== 'undefined' && 'ALLOW_KEYBOARD_INPUT' in Element;
    
    if (keyboardNotAllowed) {
      // This is Safari, and keyboard events will be disabled. Don't allow fullscreen here.
      endTrial({
        success: false,
        age: null,
        sex: null
      });
    } else if (!trial.fullscreen_mode) {
      // Exit fullscreen mode
      exitFullscreen();
      cleanupEventListeners();
      endTrial({
        success: true,
        fullscreen: false
      });
    } else {
      // Display the form for entering fullscreen
      var html = `
        ${trial.preamble}
        <form id="jspsych-survey-form">
          <label for="age">Vanus:</label>
          <input type="number" id="age" name="age" min="18" required><br><br>
          <label for="sex">Sugu:</label>
          <select id="sex" name="sex" required>
            <option value="">Vali sugu</option>
            <option value="mees">Mees</option>
            <option value="naine">Naine</option>
            <option value="muu">Muu</option>
          </select><br><br>
          <p><b>Sinu ülesanne:</b> jälgi ekraanile ilmuvaid sõnu ja proovi need meelde jätta.</p>
          <p>Katse lülitub täisekraani režiimi, kui vajutad allolevat nuppu.</p>
          <button type="submit" id="jspsych-survey-form-next" class="jspsych-btn">
            ${trial.button_label}
          </button>
        </form>`;

      display_element.innerHTML = html;

      display_element.querySelector('#jspsych-survey-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get the form data
        var formData = {
          age: document.getElementById('age').value,
          sex: document.getElementById('sex').value
        };

        // Enter fullscreen
        enterFullscreen();
        
        // Prevent escape and monitor fullscreen
        preventEscapeAndBack();
        monitorFullscreen();

        // End trial with form data
        endTrial({
          success: true,
          age: formData.age,
          sex: formData.sex,
          fullscreen: true
        });
      });
    }

    function enterFullscreen() {
      var element = document.documentElement;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
    }

    function exitFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }

    function preventEscapeAndBack() {
      // Remove existing listeners if any
      cleanupEventListeners();

      // Add new listeners
      keydownListener = function(event) {
        if (event.key === 'Escape') {
          event.preventDefault();
        }
      };
      document.addEventListener('keydown', keydownListener);

      popstateListener = function(event) {
        history.pushState(null, '', document.URL);
      };
      window.addEventListener('popstate', popstateListener);
      history.pushState(null, '', document.URL);
    }

    function monitorFullscreen() {
      // Remove existing listener if any
      if (fullscreenChangeListener) {
        document.removeEventListener('fullscreenchange', fullscreenChangeListener);
      }

      // Add new listener
      fullscreenChangeListener = function() {
        if (!document.fullscreenElement && trial.fullscreen_mode) {
          enterFullscreen();
        }
      };
      document.addEventListener('fullscreenchange', fullscreenChangeListener);
    }

    function cleanupEventListeners() {
      // Remove fullscreen change listener
      if (fullscreenChangeListener) {
        document.removeEventListener('fullscreenchange', fullscreenChangeListener);
        fullscreenChangeListener = null;
      }

      // Remove keydown listener
      if (keydownListener) {
        document.removeEventListener('keydown', keydownListener);
        keydownListener = null;
      }

      // Remove popstate listener
      if (popstateListener) {
        window.removeEventListener('popstate', popstateListener);
        popstateListener = null;
      }
    }

    function endTrial(data) {
      display_element.innerHTML = '';

      jsPsych.pluginAPI.setTimeout(function() {
        // Add the collected data to jsPsych's data set
        if (data.age) {
          jsPsych.data.addProperties({
            age: data.age,
            sex: data.sex
          });
        }

        jsPsych.finishTrial(data);
      }, trial.delay_after);
    }
  };

  return plugin;
})();