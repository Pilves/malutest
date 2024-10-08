
document.addEventListener("DOMContentLoaded", function() {

  // Function to shuffle words
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); 
      [array[i], array[j]] = [array[j], array[i]]; 
    }
    return array;
  }
  var stage1Words = shuffle(['Raamat', 'Tool', 'Jää', 'Joon', 'Kaart', 'Klaas', 'Õun', 'Sein', 'Teater', 'Lammas', 'Pastakas', 'Kivi', 'Lauk', 'Kuu', 'Lamp']);
  var stage2Words = shuffle(['Jakk', 'Puu', 'Raadio', 'Aken', 'Järv', 'Ring', 'Leht', 'Raamat', 'Klaas', 'Ratas', 'Tänav', 'Loss', 'Kuningas', 'Sild', 'Kaste']);
  var stage3Words = shuffle(['Kontor', 'Poiss', 'Lill', 'Auto', 'Tasku', 'Pall', 'Lint', 'Jõgi', 'Tüdruk', 'Aken', 'Kuju', 'Kork', 'Sõrmus', 'Sadam', 'Aed']);
  var stage4Words = shuffle(['Kott', 'Maja', 'Arbuus', 'Pliiats', 'Kool', 'Paber', 'Saabas', 'Taim', 'Linn', 'Kardin', 'Käik', 'Aken', 'Redel', 'Rida', 'Põld']);

  var trials = [];


  function createWordTrials(words, background, textClass) {
    var trials = [];
    words.forEach(function(word) {
        trials.push({
            type: 'html-keyboard-response',
            stimulus: '<p class="' + textClass + '">' + word + '</p>',
            choices: jsPsych.NO_KEYS,
            trial_duration: 20,
            data: {
                word: word,
                bg: background,
                txtClass: textClass
            },
            on_finish: function(data) {

                participantResponses.push({
                  word: data.word,
                  response: data.response || null,
                  rt: data.rt || null
                });
            },
            on_start: function() {
                document.body.style.backgroundColor = background;
                document.documentElement.style.backgroundColor = background;
                document.body.style.height = "100vh";
                document.body.style.width = "100vw";

                var experimentElement = document.getElementById('jspsych-experiment');
                experimentElement.style.backgroundColor = 'transparent';
                experimentElement.style.boxShadow = 'none';
                experimentElement.style.borderRadius = '0';
            }
        });
    });
    return trials;
  }


  
  function createRecallTrial(instruction) {
    return {
      type: 'survey-text',
      questions: [{ prompt: instruction, rows: 5, columns: 40 }],
      on_start: function() {
        document.body.style.backgroundColor = 'white';
      },
      trial_duration: 90000
    };
  }
  

  var stage1Trials = createWordTrials(stage1Words, '#413DFF', 'small-word');
  var stage1Recall = createRecallTrial("Palun kirjuta 1.5 minuti jooksul üles kõik sõnad, mida sa just nägid. Sõnade vahele sisesta koma ja jätka tühikuta. Näide: koer,kass,maja");

  var stage2Trials = createWordTrials(stage2Words, '#FF413D', 'large-word');
  var stage2Recall = createRecallTrial("Palun kirjuta 1.5 minuti jooksul üles kõik sõnad, mida sa just nägid. Sõnade vahele sisesta koma ja jätka tühikuta. Näide: koer,kass,maja");

  var stage3Trials = createWordTrials(stage3Words, '#FF413D', 'small-word');
  var stage3Recall = createRecallTrial("Palun kirjuta 1.5 minuti jooksul üles kõik sõnad, mida sa just nägid. Sõnade vahele sisesta koma ja jätka tühikuta. Näide: koer,kass,maja");

  var stage4Trials = createWordTrials(stage4Words, '#413DFF', 'large-word');
  var stage4Recall = createRecallTrial("Palun kirjuta 1.5 minuti jooksul üles kõik sõnad, mida sa just nägid. Sõnade vahele sisesta koma ja jätka tühikuta. Näide: koer,kass,maja");

  var timeline = [];
  
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
      <label><input type="checkbox" id="checkbox1"> Olen täisealine (18-aastane või vanem);</label><br>
      <label><input type="checkbox" id="checkbox2"> Osalen enda teada uuringus esimest korda;</label><br>
      <label><input type="checkbox" id="checkbox3"> Olen tutvunud uuringu tutvustusega;</label><br>
      <label><input type="checkbox" id="checkbox4"> Olen teadlik, et uuringu käigus minult kogutud andmeid kasutatakse anonüümselt teadus-, arendus- ja õppetöö eesmärkidel;</label><br>
      <label><input type="checkbox" id="checkbox5"> Olen nõus vabatahtlikult uuringus osalema.</label>
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

  timeline.push({
    type: 'html-button-response',
    stimulus: `
      <p>Olen nüüd valmis alustama katset, mis uurib, kuidas taustavärv ja sõnade fondi suurus mõjutavad mälu.</p>
      <p>Palun soorita katse vaikses ja häirimatus keskkonnas.<br>Veendu, et sul on hea internetiühendus ja ekraanile ei paista päike.<br>Palun kasuta katse tegemiseks arvutit, mitte telefoni.</p>
      <p><b>Sinu ülesanne:</b> jälgi ekraanile ilmuvaid sõnu ja proovi need meelde jätta.</p>
      <p>Kui oled valmis, vajuta <b>Start</b>, et alustada katset.</p>
    `,
    choices: ['Start']
  });
  
  timeline.push({
    type: 'fullscreen',
    fullscreen_mode: true
  });

  timeline = timeline.concat(stage1Trials);
  timeline.push(stage1Recall);
  timeline = timeline.concat(stage2Trials);
  timeline.push(stage2Recall);
  timeline = timeline.concat(stage3Trials);
  timeline.push(stage3Recall);
  timeline = timeline.concat(stage4Trials);
  timeline.push(stage4Recall);

  var participantResponses = [];

  
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
        
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }

        const allData = jsPsych.data.get().values();

        let words = [];
        let userResponses = [];

        allData.forEach(trial => {
          if (trial.word) {

              words.push(trial.word);
          }
    
          if (trial.response && trial.response.Q0) {

              userResponses.push(trial.response.Q0.trim());
          }
        });

        const finalData = {
          "user response": userResponses
        };

        const jsonData = JSON.stringify(finalData, null, 2);
    
        document.getElementById('dataInput').value = jsonData;

        if (data.response === 0) {
          jsPsych.addNodeToEndOfTimeline({
            type: 'survey-text',
            questions: [{ prompt: "Sisestage oma nimi katsetundide saamiseks:", rows: 1, columns: 50 }],
            on_finish: function() {
              var lastTrialData = jsPsych.data.get().last(1).values()[0];
              if (lastTrialData && lastTrialData.response && lastTrialData.response.Q0) {
                var participantName = lastTrialData.response.Q0.trim();
                document.getElementById('participantName').value = participantName;

                var currentDate = new Date();
                var formattedDate = currentDate.toLocaleDateString('et-EE');
    
                document.getElementById('jspsych-experiment').innerHTML = `
                  <h2>Kinnitus</h2>
                  <p>Kinnitame, et <b>${participantName}</b> osales "Taustavärvi ja sõnade fondi mõju mälule"uuringus.</p>
                  <p>Katse toimumise kuupäev: <b>${formattedDate}</b></p>
                  <p>Osalejale on määratud 0,25 katsetundi.</p>
                  <p>Palun esitage see kinnitus oma õppejõule katsetundide saamiseks.</p>
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
            }
          });
        } else {
          document.getElementById('jspsych-experiment').innerHTML = `
            <h2>Eksperiment on nüüd lõppenud</h2>
            <p>Palun oota kuni minut enne vahelehe sulgemist.</p>
          `;
          document.getElementById('dataForm').submit();
        }
    
      }
    };

    timeline.push(finalMessageTrial);


    jsPsych.init({
      timeline: timeline,
      display_element: 'jspsych-experiment',
      on_finish: function() {
        console.log('Experiment complete');
        console.log(jsPsych.data.get().values());
      }
    });
    
});
  