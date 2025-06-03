document.addEventListener('DOMContentLoaded', function() {
    // Actualizar año en el footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Cargar datos del JSON
    fetch('file.json')
        .then(response => response.json())
        .then(data => {
            // Mostrar estadísticas generales
            displayStats(data);
            
            // Mostrar todos los estudiantes inicialmente
            displayStudents(data);
            
            // Configurar filtros
            setupFilters(data);
        })
        .catch(error => {
            console.error('Error al cargar los datos:', error);
            document.getElementById('students-container').innerHTML = 
                '<p class="error">Error al cargar la información de los estudiantes.</p>';
        });
});

function displayStats(students) {
    // Total de estudiantes
    document.getElementById('total-students').textContent = students.length;
    
    // Calcular promedios
    const websiteScores = students.map(s => {
        const scores = s.projects.find(p => p.name === 'bit-website').score;
        return scores.reduce((a, b) => a + b, 0) / scores.length;
    }).filter(score => !isNaN(score));
    
    const bit1Scores = students.map(s => {
        const scores = s.projects.find(p => p.name === 'bit-1').score;
        return scores.reduce((a, b) => a + b, 0) / scores.length;
    }).filter(score => !isNaN(score));
    
    const avgWebsite = websiteScores.reduce((a, b) => a + b, 0) / websiteScores.length;
    const avgBit1 = bit1Scores.reduce((a, b) => a + b, 0) / bit1Scores.length;
    
    document.getElementById('avg-website').textContent = avgWebsite.toFixed(2);
    document.getElementById('avg-bit1').textContent = avgBit1.toFixed(2);
}

function displayStudents(students, filters = { intensity: 'all', project: 'all' }) {
    const container = document.getElementById('students-container');
    container.innerHTML = '';
    
    // Filtrar estudiantes
    const filteredStudents = students.filter(student => {
        // Filtro por intensidad
        const intensityMatch = filters.intensity === 'all' || 
                             student.intensity.includes(filters.intensity);
        
        // Filtro por proyecto (modificado para mostrar estudiantes aunque tengan 0)
        let projectMatch = true;
        if (filters.project !== 'all') {
            const project = student.projects.find(p => p.name === filters.project);
            projectMatch = project; // Solo verifica que exista el proyecto, no el score
        }
        
        return intensityMatch && projectMatch;
    });
    
    if (filteredStudents.length === 0) {
        container.innerHTML = '<p class="no-results">No se encontraron estudiantes con los filtros seleccionados.</p>';
        return;
    }
    
    // Mostrar estudiantes filtrados
    filteredStudents.forEach(student => {
        const websiteProject = student.projects.find(p => p.name === 'bit-website');
        const bit1Project = student.projects.find(p => p.name === 'bit-1');
        
        const websiteScore = websiteProject.score.reduce((a, b) => a + b, 0) / websiteProject.score.length;
        const bit1Score = bit1Project.score.reduce((a, b) => a + b, 0) / bit1Project.score.length;
        
        const intensityClass = `intensity-${student.intensity.split(' ')[0]}`;

        const githubUsername = student.usernameGithub || null;
        const githubLink = githubUsername
            ? `<a href="https://github.com/${githubUsername}" target="_blank" rel="noopener noreferrer">${githubUsername}</a>`
            : 'No disponible';
        const githubImg = githubUsername
            ? `<img class="student-avatar" src="https://github.com/${githubUsername}.png" alt="Avatar de ${student.student}">`
            : '';

        container.innerHTML += `
            <div class="student-card">
                <div class="student-header">
                    ${githubImg}
                    <div>
                        <h3>${student.student}</h3>
                        <span class="student-code">Código: ${student.code}</span>
                    </div>
                </div>
                <div class="student-body">
                    <div class="student-meta">
                        <span>Intensidad:</span>
                        <span class="intensity ${intensityClass}">${student.intensity}</span>
                    </div>

                    <div class="student-meta">
                        <span>GitHub:</span>
                        <span class="github-username">${githubLink}</span>
                    </div>

                    <div class="project">
                        <h4>bit-website</h4>
                        <div class="score score-${Math.floor(websiteScore)}">${websiteScore.toFixed(2)}</div>
                        <div class="score-detail">Detalle: ${websiteProject.score.join(', ')}</div>
                    </div>

                    <div class="project">
                        <h4>bit-1</h4>
                        <div class="score score-${Math.floor(bit1Score)}">${bit1Score.toFixed(2)}</div>
                        <div class="score-detail">Detalle: ${bit1Project.score.join(', ')}</div>
                    </div>
                </div>
            </div>
        `;
    });
}

function setupFilters(students) {
    const intensityFilter = document.getElementById('intensity-filter');
    const projectFilter = document.getElementById('project-filter');
    
    intensityFilter.addEventListener('change', () => {
        displayStudents(students, {
            intensity: intensityFilter.value,
            project: projectFilter.value
        });
    });
    
    projectFilter.addEventListener('change', () => {
        displayStudents(students, {
            intensity: intensityFilter.value,
            project: projectFilter.value
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".slide");
  let current = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("activo", i === index);
    });
  }

  function nextSlide() {
    current = (current + 1) % slides.length;
    showSlide(current);
  }

  // Mostrar la primera imagen al cargar
  showSlide(current);

  // Cambiar cada 4 segundos
  setInterval(nextSlide, 4000);
});
//carrusel
document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".slide");
  let currentIndex = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove("activo");
    });
    slides[index].classList.add("activo");
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  }

  showSlide(currentIndex); // Muestra el primero
  setInterval(nextSlide, 4000); // Cambia cada 4 segundos
});
