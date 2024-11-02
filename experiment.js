document.addEventListener("DOMContentLoaded", function() {

  //shuffle words just for fun
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); 
      [array[i], array[j]] = [array[j], array[i]]; 
    }
    return array;
  }

  //all words for the experiment
  const words1 = shuffle(['Raamat', 'Tool', 'Jää', 'Joon', 'Kaart', 'Klaas', 'Õun', 'Sein', 'Teater', 'Lammas', 'Pastakas', 'Kivi', 'Lauk', 'Kuu', 'Lamp']);
  const words2 = shuffle(['Jakk', 'Puu', 'Raadio', 'Aken', 'Järv', 'Ring', 'Leht', 'Raamat', 'Klaas', 'Ratas', 'Tänav', 'Loss', 'Kuningas', 'Sild', 'Kaste']);
  const words3 = shuffle(['Kontor', 'Poiss', 'Lill', 'Auto', 'Tasku', 'Pall', 'Lint', 'Jõgi', 'Tüdruk', 'Aken', 'Kuju', 'Kork', 'Sõrmus', 'Sadam', 'Aed']);
  const words4 = shuffle(['Kott', 'Maja', 'Arbuus', 'Pliiats', 'Kool', 'Paber', 'Saabas', 'Taim', 'Linn', 'Kardin', 'Käik', 'Aken', 'Redel', 'Rida', 'Põld']);

// Create trials for the experiment
function createWordTrials(words, background, textClass) {
  return words.map(word => ({
    type: 'html-keyboard-response',
    stimulus: `<p class="${textClass}">${word}</p>`,
    choices: jsPsych.NO_KEYS,
    trial_duration: 2000,
    data: { word: word, bg: background, txtClass: textClass },
    on_start: function() {
      document.body.style.backgroundColor = background;
      document.documentElement.style.backgroundColor = background;
      document.body.style.height = "100vh";
      document.body.style.width = "100vw";
      
      const experimentElement = document.getElementById('jspsych-experiment');
      if (experimentElement) {
        experimentElement.style.backgroundColor = 'transparent';
        experimentElement.style.boxShadow = 'none';
        experimentElement.style.borderRadius = '0';
      }
    }
  }));
}

// Create an array to store all recall responses
var allRecallResponses = [];

// Create recall trial for the experiment
function createRecallTrial(instruction, background, textClass) {
  return {
    type: 'survey-text',
    questions: [{ prompt: instruction, rows: 5, columns: 40 }],
    on_start: function() {
      document.body.style.backgroundColor = 'white';
    },
    on_finish: function(data) {
      // Ensure you set the correct background and text class for recall responses
      allRecallResponses.push({
        response: data.response.Q0.trim(),
        background: background, 
        textClass: textClass     
      });
    },
    trial_duration: 90000
  };
}

  //create timeline for the experiment
  var timeline = [];
  
  //first page of the experiment
  timeline.push({
    type: 'html-button-response',
    stimulus: `
      <h2>Hea uuringus osaleja!</h2>
      <p>Käesoleva uuringuga soovime uurida, kuidas taustavärv ja sõnade fondi suurus mõjutavad inimeste mäluvõimet.</p>
      <p>Uuring viiakse läbi Tartu Ülikooli Psühholoogia instituudi eksperimentaalpsühholoogia aine raames. Uuringu käigus näed sa erinevaid sõnu, mis kuvatakse ekraanil erineva taustavärvi ja fondi suurusega.</p>
      <p>Pärast iga sõnade loetelu kuvamist palume sul meenutada ja kirja panna nii palju sõnu, kui sa mäletad. Osalemine võtab aega umbes 15 minutit.</p>
      <p>Uuringus osalemine on vabatahtlik ja sul on õigus osalemisest igal hetkel loobuda, jättes katse pooleli. Kõik uuringu raames kogutud andmed on konfidentsiaalsed ja anonüümsed. Kogutud andmeid kasutavad ainult uuringu läbiviijad ning andmeid kasutatakse teadus-, arendus- ja õppetööks.</p>
      <p>Palume sul uuringus osaleda ainult ühe korra. Kui oled Tartu Ülikooli psühholoogiatudeng, on sul võimalik uuringus osalemise eest teenida 0,25 katsetundi.</p>
      <p>Kui sul on uuringu kohta küsimusi, siis võta meiega julgelt ühendust: <a href="mailto:agne.sokolov@gmail.com">agne.sokolov@gmail.com</a></p>
      <br>
      <p><b>Käesolevas uuringus osalemisel kinnitan järgnevate punktidega nõustumist (märgi kõik sobivad):</b></p>
      <div class="checkboxes">
      <label><input type="checkbox" id="checkbox1"> Olen täisealine (18-aastane või vanem).</label><br>
      <label><input type="checkbox" id="checkbox2"> Osalen enda teada uuringus esimest korda.</label><br>
      <label><input type="checkbox" id="checkbox3"> Olen tutvunud uuringu tutvustusega.</label><br>
      <label><input type="checkbox" id="checkbox5"> Olen nõus vabatahtlikult uuringus osalema.</label><br>
      <label><input type="checkbox" id="checkbox4"> Olen teadlik, et uuringu käigus minult kogutud andmeid kasutatakse anonüümselt teadus-, arendus- ja õppetöö eesmärkidel.</label><br>
      </div>
      <button class="select-all">Vali kõik</button>
    `,
    choices: ['ALUSTA'],
    button_html: '<button disabled class="jspsych-btn">%choice%</button>',
    on_load: function() {
      document.querySelector('.select-all').addEventListener('click', function() {
        const checkboxes = document.querySelectorAll('.checkboxes input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
          checkbox.checked = true;
        });
        checkAllMarked();
      });
      function checkAllMarked() {
        const allChecked = document.getElementById('checkbox1').checked &&
                           document.getElementById('checkbox2').checked &&
                           document.getElementById('checkbox3').checked &&
                           document.getElementById('checkbox4').checked &&
                           document.getElementById('checkbox5').checked;
        const startButton = document.querySelector('.jspsych-btn');
        if (allChecked) {
          startButton.disabled = false; 
        } else {
          startButton.disabled = true; 
        }
      }
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', checkAllMarked);
      });
    },
    on_finish: function() {
      document.body.style.backgroundColor = 'white';
    }
  });

  //second page of the experiment
  timeline.push({
    type: 'survey-html-form',
    preamble: `
      <p>Olen nüüd valmis alustama katset, mis uurib, kuidas taustavärv ja sõnade fondi suurus mõjutavad mälu.</p>
      <p>Palun soorita katse vaikses ja häirimatus keskkonnas.<br>Veendu, et sul on hea internetiühendus ja ekraanile ei paista päike.<br>Palun kasuta katse tegemiseks arvutit, mitte telefoni.</p>
      <p><b>Sinu ülesanne:</b> jälgi ekraanile ilmuvaid sõnu ja proovi need meelde jätta.</p>
      <p>Enne alustamist palun sisesta oma vanus ja vali sugu.</p>
    `,
    html: `
      <label for="age">Vanus:</label>
      <input type="number" id="age" name="age" min="18" required><br><br>
      <label for="sex">Sugu:</label>
      <select type="sex" id="sex" name="sex" required>
        <option value="">Vali sugu</option>
        <option value="mees">Mees</option>
        <option value="naine">Naine</option>
        <option value="muu">Muu</option>
      </select><br><br>
    `,
    button_label: 'Start',
    on_finish: function(data) {
      // The data.response contains the form data
      var responses = data.response;
      
      // Access the age and sex fields from the form responses
      var age = responses['age'];
      var sex = responses['sex'];

      // Store these details in the data set for later use
      jsPsych.data.addProperties({
        age: age,
        sex: sex
      });
    }
  });

  //fullscreen mode
  timeline.push({
    type: 'fullscreen',
    fullscreen_mode: true
  });

  //create trials for the experiment
  var instruction = "Palun kirjuta 1.5 minuti jooksul üles kõik sõnad, mida sa just nägid. Sõnade vahele sisesta koma ja jätka tühikuta. Näide: koer,kass,maja";
  var stage1Trials = createWordTrials(words1, '#413DFF', 'small-word');
  var stage1Recall = createRecallTrial(instruction, '#413DFF', 'small-word');
  var stage2Trials = createWordTrials(words2, '#FF413D', 'large-word');
  var stage2Recall = createRecallTrial(instruction, '#FF413D', 'large-word');
  var stage3Trials = createWordTrials(words3, '#FF413D', 'small-word');
  var stage3Recall = createRecallTrial(instruction, '#FF413D', 'small-word');
  var stage4Trials = createWordTrials(words4, '#413DFF', 'large-word');
  var stage4Recall = createRecallTrial(instruction, '#413DFF', 'large-word');

  //shuffle stages
  const stages = [
    { trials: stage1Trials, recall: stage1Recall, color: '#413DFF' },
    { trials: stage2Trials, recall: stage2Recall, color: '#FF413D' },
    { trials: stage3Trials, recall: stage3Recall, color: '#FF413D' },
    { trials: stage4Trials, recall: stage4Recall, color: '#413DFF' }
  ];
  
  function selectStages(stages) {
    let shuffled = [];
    let remaining = [...stages];
  
    while (remaining.length > 0) {
      let currentStage = remaining.splice(Math.floor(Math.random() * remaining.length), 1)[0];
      shuffled.push(currentStage);
    }
  
    return shuffled;
  }
  const shuffledStages = selectStages(stages);
  while (shuffledStages.length > 0) {
    let currentStage = shuffledStages.splice(Math.floor(Math.random() * shuffledStages.length), 1)[0];
    timeline = timeline.concat(currentStage.trials);
    timeline.push(currentStage.recall);
  }


    var finalMessageTrial = {
      type: 'html-button-response',
      stimulus: `
        <h2>Aitäh katse läbimise eest!</h2>
        <p>Antud uuringuga soovime täpsemalt uurida, kuidas mõjutavad erinevad taustavärvid ja sõnade fondi suurus mälu sooritust.</p>
        <p>Kui teil on uuringu kohta küsimusi või soovite uuringu üldtulemuste osas tagasisidet, siis palun kirjutage: <a href="mailto:agne.sokolov@gmail.com">agne.sokolov@gmail.com</a></p>
        <p>Palun hoidke katse sisu ja eesmärgid konfidentsiaalsed.</p>
        <p>Tartu Ülikooli psühholoogiatudengitel on võimalik uuringus osalemise eest teenida 0,25 katsetundi.</p>
        <p>Kui soovid katsetunde, siis vajuta nuppu <b>Soovin katsetunde</b> ja tee foto ekraanil kuvatavast infost.</p>
        <p>Kui ei soovi katsetunde, siis vajuta katse lõpetamiseks nuppu <b>Lõpeta</b>.</p>
      `,
      choices: ['Soovin katsetunde', 'Lõpeta'],
      on_finish: function(data) {
        // Exit full screen if enabled
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }

        // Process experiment data and prepare for form submission
        const finalData = processExperimentData();

        // Convert finalData to JSON format
        const jsonData = JSON.stringify(finalData, null, 2);

        // Set the hidden input field values in the form for submission
        document.getElementById('dataInput').value = jsonData;
    
        // Handle different responses (like "Soovin katsetunde" or "Lõpeta")
        if (data.response === 0) { // If "Soovin katsetunde" is clicked
          jsPsych.addNodeToEndOfTimeline({
            type: 'survey-html-form',
            preamble: '<p>Palun sisestage oma andmed katsetundide saamiseks:</p>',
            html: `
                  <div class="form-container">
                    <div>
                      <label for="firstname">Eesnimi:</label>
                      <input type="text" id="firstname" name="firstname" required>
                    </div>
                    <div>
                      <label for="lastname">Perekonnanimi:</label>
                      <input type="text" id="lastname" name="lastname" required>
                    </div>
                    <div>
                      <label for="email">E-post:</label>
                      <input type="email" id="email" name="email" required>
                    </div>
                  </div>
                `,
            button_label: 'Jätka',
            on_finish: function(formData) {
              const responses = formData.response;
              const firstName = responses.firstname.trim();
              const lastName = responses.lastname.trim();
              const email = responses.email.trim();

              document.getElementById('participantName').value = firstName + ' ' + lastName;
              document.getElementById('participantEmail').value = email;

              var currentDate = new Date();
              var formattedDate = currentDate.toLocaleDateString('et-EE');

              document.getElementById('jspsych-experiment').innerHTML = `
        <h2>Kinnitus</h2>
        <p>Kinnitame, et <b>${firstName} ${lastName}</b> osales "Taustavärvi ja sõnade fondi mõju mälule" uuringus.</p>
        <p>Katse toimumise kuupäev: <b>${formattedDate}</b></p>
        <p>Osalejale on määratud 0,25 katsetundi.</p>
        <button id="submit-button" style="margin-top: 20px; padding: 10px; font-size: 16px;">Lõpeta</button>
      `;

              document.getElementById('submit-button').addEventListener('click', function() {
                document.getElementById('jspsych-experiment').innerHTML = `
          <h2>Eksperiment on nüüd lõppenud</h2>
          <p>Palun oota kuni minut enne vahelehe sulgemist.</p>
        `;
                document.getElementById('dataForm').submit();
              });
            }
          });
        } else { // If "Lõpeta" is clicked
          document.getElementById('jspsych-experiment').innerHTML = `
            <h2>Eksperiment on nüüd lõppenud</h2>
            <p>Palun oota kuni minut enne vahelehe sulgemist.</p>
          `;
          document.getElementById('dataForm').submit(); // Submit the form with hidden inputs
        }
      }
    };
    
    function processExperimentData() {
      // Retrieve the demographic data (age, sex) from the survey
      const demographic = {
        age: jsPsych.data.get().filter({trial_type: 'survey-html-form'}).select('response').values[0]?.age,
        sex: jsPsych.data.get().filter({trial_type: 'survey-html-form'}).select('response').values[0]?.sex
      };
    
      // Sort recall responses based on background and text class
      const sortedRecallResponses = allRecallResponses.sort((a, b) => {
        const order = [
          { background: '#413DFF', textClass: 'small-word' },  // Blue background, small font
          { background: '#FF413D', textClass: 'large-word' },  // Red background, large font
          { background: '#FF413D', textClass: 'small-word' },  // Red background, small font
          { background: '#413DFF', textClass: 'large-word' }   // Blue background, large font
        ];
    
        const aOrder = order.findIndex(item => item.background === a.background && item.textClass === a.textClass);
        const bOrder = order.findIndex(item => item.background === b.background && item.textClass === b.textClass);
        
        return aOrder - bOrder;
      });
    
      return {
        demographic,
        recallResponses: sortedRecallResponses.map(item => item.response)
      };
    }
    
    timeline.push(finalMessageTrial);


    jsPsych.init({
      timeline: timeline,
      display_element: 'jspsych-experiment',
      on_finish: function() {
        console.log('Experiment complete');
        console.log(document.getElementById("dataForm"));
      }
    });
    
});
  