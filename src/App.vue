<template>
  <div class="flex flex-col min-h-screen p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full gap-6 text-gray-200">
      
      <div v-if="isEmergencyMode" class="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center bg-red-600/20 transition-all duration-300">
          <div class="absolute inset-0 bg-red-600/20 animate-pulse mix-blend-overlay"></div>
          <div class="bg-[#1a0505]/95 border border-red-500/50 p-8 rounded-3xl shadow-[0_0_100px_rgba(239,68,68,0.4)] backdrop-blur-xl text-center pointer-events-auto max-w-sm w-full mx-4">
              <div class="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
                  <i class="fa-solid fa-triangle-exclamation text-5xl text-red-500 animate-bounce"></i>
              </div>
              <h2 class="text-3xl font-black text-white mb-2 tracking-widest">SOS ACTIVE</h2>
              <p class="text-red-300 mb-8 text-sm font-medium">Emergency protocols engaged. Your vital snapshot has been exported automatically. Please contact emergency services.</p>
              <button @click="isEmergencyMode = false" class="w-full py-3.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-500 transition-colors shadow-lg shadow-red-600/20">ACKNOWLEDGE & DISMISS</button>
          </div>
      </div>

      <div v-if="showAbnormalOverlay" class="fixed inset-0 z-[90] pointer-events-none flex items-center justify-center bg-amber-600/10 transition-all duration-300 backdrop-blur-sm">
          <div class="absolute inset-0 bg-amber-600/10 animate-pulse mix-blend-overlay"></div>
          <div class="bg-[#1a1105]/95 border border-amber-500/50 p-8 rounded-3xl shadow-[0_0_80px_rgba(245,158,11,0.3)] backdrop-blur-xl text-center pointer-events-auto max-w-md w-full mx-4">
              <div class="w-24 h-24 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-6">
                  <i class="fa-solid fa-heart-crack text-5xl text-amber-500 animate-pulse"></i>
              </div>
              <h2 class="text-3xl font-black text-white mb-2 tracking-widest">{{ abnormalOverlayData.title }}</h2>
              <div class="text-6xl font-bold text-white my-4">{{ abnormalOverlayData.bpm }} <span class="text-xl text-amber-400">BPM</span></div>
              <p class="text-amber-200 mb-8 text-sm font-medium">{{ abnormalOverlayData.message }}</p>
              <button @click="showAbnormalOverlay = false" class="w-full py-3.5 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-500 transition-colors shadow-lg shadow-amber-600/20">ACKNOWLEDGE ALARM</button>
          </div>
      </div>

      <header class="flex flex-col md:flex-row justify-between items-center gap-4 glass-panel p-4 rounded-3xl z-10 relative">
          <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                  <i class="fa-solid fa-heart-pulse text-xl"></i>
              </div>
              <h1 class="text-2xl font-extrabold tracking-wider text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.1)]">
                  Cardio<span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Metrics</span>
              </h1>
              
              <span v-if="isConnected && isMeasuring" class="ml-2 px-3 py-1 w-[140px] justify-center bg-green-500/10 text-green-400 text-xs rounded-full border border-green-500/20 flex items-center gap-2 font-medium">
                  <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_#4ade80] shrink-0"></div> SENSOR ACTIVE
              </span>
              <span v-else-if="isConnected && !isMeasuring" class="ml-2 px-3 py-1 w-[140px] justify-center bg-yellow-500/10 text-yellow-400 text-xs rounded-full border border-yellow-500/20 flex items-center gap-2 font-medium">
                  <div class="w-2 h-2 bg-yellow-400 rounded-full shrink-0"></div> STANDBY
              </span>
              <span v-else class="ml-2 px-3 py-1 w-[140px] justify-center bg-red-500/10 text-red-400 text-xs rounded-full border border-red-500/20 flex items-center gap-2 font-medium">
                  <div class="w-2 h-2 bg-red-400 rounded-full shrink-0"></div> OFFLINE
              </span>
          </div>

          <nav class="hidden md:flex items-center gap-2 bg-[#0B0F19] px-2 py-1 rounded-full border border-gray-800">
              <button @click="activeTab = 'dashboard'" :class="activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'" class="px-5 py-2 rounded-full text-sm font-medium transition-all">
                  <i class="fa-solid fa-chart-pie mr-2"></i> Dashboard
              </button>
              <button @click="activeTab = 'reports'" :class="activeTab === 'reports' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'" class="px-5 py-2 rounded-full text-sm font-medium transition-all">
                  <i class="fa-solid fa-file-medical mr-2"></i> Reports
              </button>
              <button @click="activeTab = 'calendar'" :class="activeTab === 'calendar' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'" class="px-5 py-2 rounded-full text-sm font-medium transition-all">
                  <i class="fa-solid fa-calendar mr-2"></i> Calendar
              </button>
          </nav>

          <div class="flex items-center gap-3">
              <button class="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                  <i class="fa-solid fa-bell text-gray-300"></i>
              </button>
              <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center cursor-pointer border-2 border-transparent hover:border-white transition-all shadow-[0_0_15px_rgba(99,102,241,0.4)] text-white">
                  <i class="fa-solid fa-user text-sm"></i>
              </div>
          </div>
      </header>

    <section data-section="clinical-live-update" class="glass-panel rounded-2xl p-4 border border-cyan-500/20 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
              <p class="text-xs uppercase tracking-[0.18em] text-cyan-300 font-semibold">Clinical live update</p>
              <p class="text-sm text-gray-200 mt-1">{{ latestClinicalSummary }}</p>
          </div>
          <div class="flex items-center gap-2">
              <span class="px-3 py-1 rounded-full text-xs font-semibold border" :class="assistantStateClass">{{ assistantStateText }}</span>
                  <button @click="runRapidAssessment"
                      :disabled="chatLoading || totalRecords === 0 || !geminiApiKey"
                      class="px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  Rapid assessment
              </button>
          </div>
      </section>

      <main v-if="activeTab === 'dashboard'" class="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 animate-fade-in">
          
          <div v-if="isAmberState" class="lg:col-span-12 bg-gradient-to-r from-amber-600/20 to-amber-900/20 border border-amber-500/50 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between shadow-[0_0_30px_rgba(245,158,11,0.15)] animate-fade-in z-10">
              <div class="flex items-center gap-4 mb-3 sm:mb-0">
                  <div class="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 animate-pulse text-xl shrink-0">
                      <i class="fa-solid fa-triangle-exclamation"></i>
                  </div>
                  <div>
                      <h3 class="text-amber-400 font-black tracking-widest uppercase text-lg drop-shadow-md">Amber State: Abnormal BPM</h3>
                      <p class="text-sm text-amber-200/90 font-medium">Live sensor is currently detecting <strong class="text-amber-400">{{ currentStatus }}</strong> ({{ currentBpm }} BPM). Please monitor closely.</p>
                  </div>
              </div>
              <button @click="showAbnormalOverlay = true" class="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-amber-600/20 shrink-0 border border-amber-400/50">
                  View Alert Details
              </button>
          </div>

          <section class="lg:col-span-4 flex flex-col gap-6">
              <div data-section="live-monitor" class="glass-panel p-6 rounded-3xl flex-1 flex flex-col relative overflow-hidden">
                  <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none"></div>
                  
                  <h2 class="text-gray-400 text-sm uppercase tracking-wider font-semibold mb-2">Live Monitor</h2>
                  <h3 class="text-3xl font-bold mb-6 text-white">Real-time <span class="text-cyan-400">Pulse</span></h3>
                  
                  <div class="flex-1 flex flex-col items-center justify-center py-8">
                      <div class="relative w-48 h-48 flex items-center justify-center transition-all duration-500">
                          <div class="absolute inset-0 border-4 rounded-full" :class="[isMeasuring ? 'animate-ping' : '', isAmberState ? 'border-amber-500/30' : 'border-red-500/20']" style="animation-duration: 1s;"></div>
                          <div class="absolute inset-4 border-4 rounded-full" :class="[isMeasuring ? 'animate-ping' : '', isAmberState ? 'border-amber-500/50' : 'border-red-500/40']" style="animation-duration: 1s; animation-delay: 0.3s;"></div>
                          <i class="fa-solid fa-heart text-9xl transition-all duration-300" :class="[
                              isMeasuring ? 'heart-pulse' : 'opacity-50 drop-shadow-none',
                              isAmberState ? 'text-amber-500 drop-shadow-[0_0_40px_rgba(245,158,11,0.7)]' : 'text-red-500 drop-shadow-[0_0_40px_rgba(239,68,68,0.7)]'
                          ]"></i>
                      </div>
                  </div>

                  <div class="flex items-end justify-between mt-auto z-10">
                      <div>
                          <p class="text-gray-400 text-sm mb-1"><i class="fa-solid fa-heart text-red-500 mr-1"></i> Heart Rate</p>
                          <div class="flex items-baseline gap-2">
                              <span class="text-6xl font-bold text-white tracking-tighter">{{ isMeasuring && currentBpm > 0 ? currentBpm : '--' }}</span>
                              <span class="text-gray-400 font-medium">bpm</span>
                          </div>
                      </div>
                      <div class="text-right pb-2">
                          <span class="px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg text-white" :class="isMeasuring ? getStatusBadgeClass(currentStatus) : 'bg-gray-800 text-gray-400 border border-gray-700'">
                              {{ isMeasuring ? currentStatus : 'Waiting...' }}
                          </span>
                      </div>
                  </div>

                  <div class="mt-6 h-24 w-full relative bg-black/40 rounded-xl border border-gray-800/50 overflow-hidden">
                      <div class="absolute inset-0 opacity-20" style="background-image: linear-gradient(#3B82F6 1px, transparent 1px), linear-gradient(90deg, #3B82F6 1px, transparent 1px); background-size: 20px 20px;"></div>
                      <canvas ref="ecgCanvasRef" class="w-full h-full relative z-10"></canvas>
                      
                      <div v-if="!isMeasuring" class="absolute inset-0 bg-[#0B0F19]/60 backdrop-blur-[1px] z-20 flex items-center justify-center transition-all duration-500">
                          <span class="text-xs text-gray-300 uppercase tracking-widest bg-black/80 px-4 py-1.5 rounded-full font-semibold border border-gray-800">No Signal</span>
                      </div>

                      <div v-if="isAmberState" class="absolute inset-0 shadow-[inset_0_0_20px_rgba(245,158,11,0.4)] pointer-events-none z-20"></div>
                  </div>
              </div>
          </section>

          <section class="lg:col-span-8 flex flex-col gap-6">
              
              <div data-section="recent-entries">
                  <div class="flex justify-between items-end mb-4 px-2">
                      <h3 class="text-xl font-semibold text-white">Recent Entries</h3>
                      <button @click="activeTab = 'reports'" class="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">View Reports <i class="fa-solid fa-arrow-right ml-1"></i></button>
                  </div>
                  
                  <div v-if="firestoreError && recentEntries.length === 0" class="text-center text-red-400 py-12 glass-panel rounded-3xl border border-red-500/30">
                      <i class="fa-solid fa-triangle-exclamation text-4xl mb-3"></i>
                      <p class="font-semibold">{{ firestoreError }}</p>
                      <p class="text-sm text-gray-400 mt-2">Please check Firebase Security Rules configuration</p>
                  </div>
                  <div v-else-if="recentEntries.length === 0" class="text-center text-gray-500 py-12 glass-panel rounded-3xl border border-dashed border-gray-700">
                      <i class="fa-solid fa-notes-medical text-4xl mb-3 opacity-50"></i>
                      <p>No data available. Please measure using your ESP32 device...</p>
                  </div>
                  
                  <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div v-for="(entry, index) in recentEntries" :key="index" 
                           class="p-6 rounded-3xl transition-transform hover:-translate-y-1 cursor-pointer relative overflow-hidden shadow-xl"
                           :class="getStatusBgClass(entry.status)">
                          <div class="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
                          
                          <div class="flex justify-between items-start mb-6 relative z-10">
                              <div class="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shadow-inner text-white">
                                  <i class="fa-solid text-xl" :class="getStatusIcon(entry.status)"></i>
                              </div>
                              <span class="text-xs font-semibold bg-black/30 text-white px-3 py-1.5 rounded-xl backdrop-blur-md">{{ entry.timeOnly }}</span>
                          </div>
                          <div class="relative z-10">
                              <p class="text-white/90 text-sm font-semibold tracking-wide uppercase">{{ entry.status }}</p>
                              <h4 class="text-4xl font-bold mt-1 text-white flex items-baseline gap-1">
                                  {{ entry.bpm }} <span class="text-base font-normal opacity-80">bpm</span>
                              </h4>
                          </div>
                      </div>
                  </div>
              </div>

              <div data-section="measurement-density" class="glass-panel p-6 rounded-3xl flex-1 flex flex-col relative">
                  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-4 z-10 relative">
                      <div>
                          <h3 class="text-xl font-semibold text-white">Measurement Density</h3>
                          <p class="text-sm text-gray-400 mt-1">Heart rate distribution over time</p>
                      </div>
                      
                      <div class="flex bg-[#0B0F19] p-1.5 rounded-xl border border-gray-800 shadow-inner">
                          <button v-for="time in ['1h', 'Today', '7d', '15d', '30d']" :key="time"
                                  @click="activeFilter = time"
                                  :class="[ 'px-4 py-1.5 rounded-lg text-sm font-medium transition-all', 
                                            activeFilter === time ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-white' ]">
                              {{ time }}
                          </button>
                      </div>
                  </div>

                  <div class="flex-1 w-full relative min-h-[250px]">
                      <apexchart type="bubble" height="100%" :options="chartOptions" :series="chartSeries"></apexchart>
                  </div>
              </div>
          </section>

          <section data-section="history-table" class="lg:col-span-12 glass-panel p-6 rounded-3xl">
              <div class="flex justify-between items-center mb-6">
                  <h3 class="text-xl font-semibold text-white">All Measurements History</h3>
                  <div class="relative">
                      <i class="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                      <input type="text" v-model="searchQuery" placeholder="Search records (ID, Status, BPM)..." class="bg-[#0B0F19] text-white placeholder-gray-500 border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-cyan-500 w-64 sm:w-80 transition-colors shadow-inner">
                  </div>
              </div>
              
              <div class="h-[400px] overflow-y-auto rounded-xl border border-gray-800/50 relative scroll-smooth bg-[#0B0F19]/20 custom-scrollbar">
                  <HistoryTable :records="filteredHistoryRecords" :firestoreError="firestoreError" />
              </div>
          </section>
      </main>

      <main v-if="activeTab === 'reports'" class="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 animate-fade-in">
          <section class="lg:col-span-12">
              <h2 class="text-3xl font-bold mb-2 text-white">Health <span class="text-cyan-400">Analytics</span></h2>
              <p class="text-gray-400 mb-8">Overview of health analytics from collected data.</p>

              <div data-section="quick-stats" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div class="glass-panel p-6 rounded-3xl flex items-center gap-4 border-l-4 border-l-blue-500">
                      <div class="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-2xl"><i class="fa-solid fa-heartbeat"></i></div>
                      <div>
                          <p class="text-sm text-gray-400">Total Measurements</p>
                          <h4 class="text-3xl font-bold text-white">{{ totalRecords }}</h4>
                      </div>
                  </div>
                  <div class="glass-panel p-6 rounded-3xl flex items-center gap-4 border-l-4 border-l-teal-500">
                      <div class="w-14 h-14 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 text-2xl"><i class="fa-solid fa-wave-square"></i></div>
                      <div>
                          <p class="text-sm text-gray-400">Average BPM</p>
                          <h4 class="text-3xl font-bold text-white">{{ reportStats.avgBpm }} <span class="text-sm font-normal text-gray-500">bpm</span></h4>
                      </div>
                  </div>
                  <div class="glass-panel p-6 rounded-3xl flex items-center gap-4 border-l-4 border-l-red-500">
                      <div class="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-2xl"><i class="fa-solid fa-arrow-trend-up"></i></div>
                      <div>
                          <p class="text-sm text-gray-400">Highest Recorded</p>
                          <h4 class="text-3xl font-bold text-white">{{ reportStats.maxBpm }} <span class="text-sm font-normal text-gray-500">bpm</span></h4>
                      </div>
                  </div>
                  <div class="glass-panel p-6 rounded-3xl flex items-center gap-4 border-l-4 border-l-indigo-500">
                      <div class="w-14 h-14 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-2xl"><i class="fa-solid fa-arrow-trend-down"></i></div>
                      <div>
                          <p class="text-sm text-gray-400">Lowest Recorded</p>
                          <h4 class="text-3xl font-bold text-white">{{ reportStats.minBpm }} <span class="text-sm font-normal text-gray-500">bpm</span></h4>
                      </div>
                  </div>
              </div>

              <div data-section="status-distribution" class="glass-panel p-8 rounded-3xl mb-8">
                  <h3 class="text-xl font-semibold mb-6 text-white">Status Distribution</h3>
                  <div class="w-full h-8 rounded-full overflow-hidden flex bg-gray-800 mb-4 shadow-inner">
                      <div class="h-full bg-blue-500 transition-all duration-1000" :style="{ width: reportStats.bradycardiaPct + '%' }" title="Bradycardia"></div>
                      <div class="h-full bg-teal-500 transition-all duration-1000" :style="{ width: reportStats.normalPct + '%' }" title="Normal"></div>
                      <div class="h-full bg-red-500 transition-all duration-1000" :style="{ width: reportStats.tachycardiaPct + '%' }" title="Tachycardia"></div>
                  </div>
                  <div class="flex justify-between text-sm">
                      <div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full bg-blue-500"></div> <span class="text-gray-400">Bradycardia (< 60) - {{ reportStats.bradycardiaPct }}%</span></div>
                      <div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full bg-teal-500"></div> <span class="text-gray-400">Normal (60-100) - {{ reportStats.normalPct }}%</span></div>
                      <div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full bg-red-500"></div> <span class="text-gray-400">Tachycardia (> 100) - {{ reportStats.tachycardiaPct }}%</span></div>
                  </div>
              </div>

              <div data-section="clinical-command" class="relative overflow-hidden glass-panel p-6 md:p-8 rounded-3xl mb-8 border border-cyan-500/20 shadow-2xl bg-[#0B0F19]/80 backdrop-blur-xl">
                  
                  <div class="absolute top-[-50px] right-[-50px] w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

                  <div class="relative z-10 flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-center">
                      <div class="max-w-xl">
                          <div class="flex items-center gap-2 mb-2">
                              <div class="w-7 h-7 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30 text-cyan-400">
                                  <i class="fa-solid fa-stethoscope text-[11px]"></i>
                              </div>
                              <p class="text-[11px] uppercase tracking-[0.2em] text-cyan-400 font-bold">Clinical Command Center</p>
                          </div>
                          <h3 class="text-2xl sm:text-3xl font-bold text-white tracking-wide">Fast triage & handoff</h3>
                      </div>

                      <div class="flex flex-wrap sm:flex-nowrap gap-3 shrink-0 w-full xl:w-auto mt-4 xl:mt-0">
                          <button @click="runRapidAssessment" :disabled="chatLoading || totalRecords === 0 || !geminiApiKey" class="group relative flex-1 sm:flex-none items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-semibold transition-all shadow-[0_8px_20px_rgba(6,182,212,0.25)] border border-cyan-400/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed">
                              <i class="fa-solid fa-wand-magic-sparkles"></i> AI Assessment
                          </button>
                          <button @click="exportClinicalSnapshot" class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-[#1e293b] hover:bg-[#2a3a50] text-white text-sm font-semibold border border-slate-700 transition-all hover:-translate-y-0.5 shadow-md">
                              <i class="fa-solid fa-file-export text-slate-400"></i> Export Note
                          </button>
                          <button @click="acknowledgeAllAlerts" class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-sm font-semibold border border-emerald-500/20 transition-all hover:-translate-y-0.5 shadow-md">
                              <i class="fa-solid fa-check-double"></i> Ack Alerts
                          </button>
                      </div>
                  </div>

                  <div class="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
                      
                      <div class="relative flex flex-col p-6 rounded-[2rem] bg-[#0d1321]/80 border border-slate-700/50 shadow-xl backdrop-blur-md overflow-hidden group hover:border-blue-500/30 transition-all duration-300">
                          <div class="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/10 transition-colors"></div>
                          
                          <div class="flex items-center justify-between mb-4 relative z-10">
                              <div class="flex items-center gap-3">
                                  <div class="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400">
                                      <i class="fa-solid fa-chart-line text-sm"></i>
                                  </div>
                                  <p class="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-bold">Today's Trend</p>
                              </div>
                          </div>

                          <div class="mb-6 relative z-10">
                              <p class="text-4xl sm:text-5xl font-black text-white tracking-tight drop-shadow-md">{{ dayTrendLabel }}</p>
                          </div>

                          <div class="mt-auto relative z-10 w-full">
                              <p class="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3 pl-1">Recent Readings</p>
                              <div class="space-y-2">
                                  <template v-if="recentEntries.length">
                                      <div v-for="(entry, idx) in recentEntries.slice(0, 3)" :key="idx" 
                                           class="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:bg-slate-800/50 transition-colors">
                                          <div class="flex items-center gap-3 text-slate-400">
                                              <i class="fa-regular fa-clock text-xs opacity-60"></i>
                                              <span class="text-xs font-medium">{{ entry.timeOnly }}</span>
                                          </div>
                                          <div class="flex items-center gap-3">
                                              <span class="text-sm font-bold text-white">{{ entry.bpm }} <span class="text-[10px] text-slate-400 font-normal">bpm</span></span>
                                              <span class="px-2 py-1 rounded-md text-[9px] uppercase font-bold tracking-wider"
                                                    :class="entry.status === 'Normal' ? 'bg-emerald-500/10 text-emerald-400' : 
                                                            entry.status === 'Tachycardia' ? 'bg-red-500/10 text-red-400' : 
                                                            'bg-blue-500/10 text-blue-400'">
                                                  {{ entry.status }}
                                              </span>
                                          </div>
                                      </div>
                                  </template>
                                  <div v-else class="flex flex-col items-center justify-center p-6 rounded-xl bg-slate-800/20 border border-dashed border-slate-700/50">
                                      <i class="fa-solid fa-wind text-slate-600 text-xl mb-2"></i>
                                      <p class="text-xs text-slate-500">No recent records available.</p>
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div class="relative flex flex-col p-6 rounded-[2rem] bg-[#0d1321]/80 border shadow-xl backdrop-blur-md overflow-hidden transition-all duration-500"
                           :class="clinicalAlerts.length > 0 ? 'border-red-500/30' : 'border-slate-700/50 hover:border-slate-600'">
                          
                          <div class="absolute inset-0 opacity-20 pointer-events-none transition-all duration-500"
                               :class="clinicalAlerts.length > 0 ? 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-600/40 via-transparent to-transparent' : 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-600/10 via-transparent to-transparent'"></div>
                          
                          <div class="flex items-center justify-between mb-4 relative z-10">
                              <div class="flex items-center gap-3">
                                  <div class="w-10 h-10 rounded-full flex items-center justify-center border transition-colors duration-500"
                                       :class="clinicalAlerts.length > 0 ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-slate-800 text-slate-400 border-slate-700'">
                                      <i class="fa-solid fa-bell text-sm" :class="{'fa-shake': clinicalAlerts.length > 0}"></i>
                                  </div>
                                  <p class="text-[11px] uppercase tracking-[0.2em] font-bold" :class="clinicalAlerts.length > 0 ? 'text-red-400' : 'text-slate-400'">Alert Queue</p>
                              </div>
                              
                              <div v-if="clinicalAlerts.length > 0" class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20">
                                  <div class="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></div>
                                  <span class="text-[9px] uppercase font-bold text-red-400 tracking-widest">Live</span>
                              </div>
                          </div>

                          <div class="mb-6 relative z-10">
                              <div class="flex items-baseline gap-2">
                                  <p class="text-6xl font-black tracking-tighter" :class="clinicalAlerts.length > 0 ? 'text-white drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'text-white'">
                                      {{ clinicalAlerts.length }}
                                  </p>
                                  <p class="text-sm font-semibold uppercase tracking-wider" :class="clinicalAlerts.length > 0 ? 'text-red-400' : 'text-slate-500'">Active</p>
                              </div>
                          </div>

                          <div class="mt-auto relative z-10 p-4 rounded-xl" :class="clinicalAlerts.length > 0 ? 'bg-red-950/20 border border-red-900/30' : 'bg-slate-800/20 border border-slate-700/30'">
                              <div class="flex gap-3">
                                  <i class="fa-solid fa-circle-info mt-0.5" :class="clinicalAlerts.length > 0 ? 'text-red-400' : 'text-slate-500'"></i>
                                  <p class="text-xs leading-relaxed" :class="clinicalAlerts.length > 0 ? 'text-red-200/80' : 'text-slate-400'">
                                      Real-time alerts generated from live sensor BPM thresholds and latest synced history records. Check patient status immediately if active.
                                  </p>
                              </div>
                          </div>
                      </div>

                  </div>
              </div>

          <div data-section="reports-log" class="glass-panel p-6 rounded-3xl">
              <div class="flex justify-between items-center mb-6">
                  <h3 class="text-xl font-semibold text-white">Full Measurements Log</h3>
                  <div class="relative">
                      <i class="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                      <input type="text" v-model="searchQuery" placeholder="Search records (ID, Status, BPM)..." class="bg-[#0B0F19] text-white placeholder-gray-500 border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-cyan-500 w-64 sm:w-80 transition-colors shadow-inner">
                  </div>
              </div>
              <div class="h-[400px] overflow-y-auto rounded-xl border border-gray-800/50 relative scroll-smooth bg-[#0B0F19]/20 custom-scrollbar">
                  <HistoryTable :records="filteredHistoryRecords" :firestoreError="firestoreError" />
              </div>
          </div>
      </section>
  </main>

  <main v-if="activeTab === 'calendar'" class="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 animate-fade-in">
          
          <section data-section="calendar-view" class="lg:col-span-8">
              <div class="glass-panel p-8 rounded-3xl flex flex-col h-full">
                  <div class="flex justify-between items-center mb-8">
                      <h2 class="text-2xl font-bold flex items-center gap-3 text-white">
                          <i class="fa-regular fa-calendar-days text-cyan-400"></i>
                          {{ monthNames[currentMonth] }} {{ currentYear }}
                      </h2>
                      <div class="flex gap-2">
                          <button @click="changeMonth(-1)" class="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors text-white"><i class="fa-solid fa-chevron-left"></i></button>
                          <button @click="changeMonth(1)" class="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors text-white"><i class="fa-solid fa-chevron-right"></i></button>
                      </div>
                  </div>

                  <div class="grid grid-cols-7 gap-2 mb-2 text-center text-gray-500 font-medium text-sm">
                      <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                  </div>
                  
                  <div class="grid grid-cols-7 gap-2">
                      <div v-for="(day, idx) in calendarDays" :key="idx" 
                           @click="selectDay(day)"
                           class="aspect-square flex flex-col items-center justify-center rounded-2xl relative transition-all"
                           :class="[
                               day.empty ? 'opacity-0 cursor-default' : 'hover:bg-[#1A1F2C] cursor-pointer',
                               day.empty ? '' : 'bg-[#1A1F2C]/40',
                               day.dateOnly === selectedDate ? 'bg-cyan-600/30 border border-cyan-500/80 shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'border border-transparent',
                               day.isToday && day.dateOnly !== selectedDate ? 'border border-gray-600' : ''
                           ]">
                          <span v-if="!day.empty" class="text-lg font-medium" :class="day.dateOnly === selectedDate ? 'text-cyan-300 font-bold' : 'text-gray-300'">{{ day.date }}</span>
                          
                          <div v-if="day.hasRecord" class="absolute bottom-2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></div>
                      </div>
                  </div>
              </div>
          </section>

          <section data-section="selected-day-details" class="lg:col-span-4 flex flex-col gap-6">
              <div class="glass-panel p-6 rounded-3xl flex-1 flex flex-col max-h-[600px]">
                  <h3 class="text-xl font-bold mb-4 pb-4 border-b border-gray-800 text-white">
                      Records: <span class="text-cyan-400">{{ selectedDate }}</span>
                  </h3>
                  
                  <div class="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                      <div v-if="selectedDateRecords.length === 0" class="text-gray-500 text-center py-12 flex flex-col items-center">
                          <i class="fa-solid fa-inbox text-3xl mb-2 opacity-30"></i>
                          No records for this day.
                      </div>
                      <div v-else v-for="rec in selectedDateRecords" :key="rec.id" class="p-4 rounded-xl bg-[#0B0F19] border border-gray-800 hover:border-gray-600 transition-colors">
                          <div class="flex justify-between items-center mb-1">
                              <span class="text-sm text-gray-400"><i class="fa-regular fa-clock mr-1"></i>{{ rec.timeOnly }}</span>
                              <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold" :class="getStatusBadgeClass(rec.status)">{{ rec.status }}</span>
                          </div>
                          <div class="text-3xl font-bold text-white mt-2">{{ rec.bpm }} <span class="text-sm font-normal text-gray-500">BPM</span></div>
                      </div>
                  </div>
              </div>
          </section>
      </main>

      <div class="fixed top-24 right-4 z-40 w-[320px] space-y-2" v-if="clinicalAlerts.length">
          <div v-for="alert in clinicalAlerts" :key="alert.id" class="rounded-2xl border px-4 py-3 backdrop-blur-md shadow-lg" :class="alert.severity === 'high' ? 'bg-red-500/15 border-red-400/50' : alert.severity === 'medium' ? 'bg-amber-500/15 border-amber-300/50' : 'bg-cyan-500/15 border-cyan-300/40'">
              <div class="flex items-start justify-between gap-3">
                  <div>
                      <p class="text-sm font-semibold text-white">{{ alert.title }}</p>
                      <p class="text-xs text-gray-200 mt-1">{{ alert.message }}</p>
                  </div>
                  <button @click="dismissAlert(alert.id)" class="text-xs text-gray-200 hover:text-white">Dismiss</button>
              </div>
          </div>
      </div>

    <div class="fixed bottom-4 right-4 md:right-8 lg:right-10 z-50 w-[360px] sm:w-[420px] max-w-[calc(100vw-2rem)]">
          <div v-if="chatOpen" class="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-[0_15px_60px_rgba(6,182,212,0.15)] backdrop-blur-2xl flex flex-col bg-[#0b0f19]/95" style="height: 65vh; max-height: 700px; min-height: 450px;">
              
              <div class="px-5 py-4 bg-[#0f1423] border-b border-white/5 flex items-center justify-between shrink-0 relative overflow-hidden shadow-sm z-20">
                  <div class="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/5 pointer-events-none"></div>
                  <div class="flex items-center gap-3 relative z-10">
                      <div class="relative group">
                          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-lg shadow-lg group-hover:scale-105 transition-transform">
                              <i class="fa-solid fa-user-doctor" v-if="assistantRole === 'doctor'"></i>
                              <i class="fa-solid fa-user-nurse" v-else-if="assistantRole === 'nurse'"></i>
                              <i class="fa-regular fa-face-smile" v-else></i>
                          </div>
                          <div class="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#0f1423] bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]"></div>
                      </div>
                      <div>
                          <h3 class="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                              MediBuddy
                          </h3>
                          <p class="text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                             <span v-if="chatLoading" class="flex items-center gap-1 text-cyan-300">
                                 <i class="fa-solid fa-circle-notch fa-spin text-[10px]"></i> Typing...
                             </span>
                             <span v-else>Online & Ready</span>
                          </p>
                      </div>
                  </div>
                  <div class="flex items-center gap-1.5 relative z-10">
                      <button @click="showPromptLibrary = !showPromptLibrary; chatMenuOpen = false" :class="showPromptLibrary ? 'text-amber-400 bg-amber-400/10' : 'text-slate-400 hover:text-white hover:bg-white/10'" class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors" title="Command Library">
                          <i class="fa-solid fa-lightbulb"></i>
                      </button>
                      <button @click="ttsEnabled = !ttsEnabled" :class="ttsEnabled ? 'text-cyan-400 bg-cyan-400/10' : 'text-slate-400 hover:text-white hover:bg-white/10'" class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors" title="Toggle Text-to-Speech">
                          <i class="fa-solid fa-volume-high"></i>
                      </button>
                      <button @click="chatMenuOpen = !chatMenuOpen; showPromptLibrary = false" class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors" title="Chat Tools">
                          <i class="fa-solid fa-ellipsis-vertical"></i>
                      </button>
                      <button @click="chatOpen = false" class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                          <i class="fa-solid fa-chevron-down"></i>
                      </button>
                  </div>
              </div>

              <div v-if="chatMenuOpen" class="px-4 py-3 border-b border-white/5 bg-[#121827] shrink-0 animate-fade-in shadow-inner z-10">
                  <div class="flex items-center justify-between mb-3">
                      <span class="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em]">Assistant Tone</span>
                      <select v-model="assistantRole" class="bg-black/40 border border-white/10 rounded-md px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-cyan-500">
                          <option value="friend">Friendly</option>
                          <option value="doctor">Doctor</option>
                          <option value="nurse">Nurse</option>
                      </select>
                  </div>
                  <div class="grid grid-cols-2 gap-2">
                      <button @click="runMenuAction('rapid')" class="text-xs py-2 px-3 rounded-lg bg-slate-800/50 hover:bg-cyan-500/20 hover:text-cyan-300 border border-slate-700/50 hover:border-cyan-500/30 transition-all text-left flex items-center gap-2">
                          <i class="fa-solid fa-bolt text-cyan-400"></i> Quick Check
                      </button>
                      <button @click="runMenuAction('history-trend')" class="text-xs py-2 px-3 rounded-lg bg-slate-800/50 hover:bg-blue-500/20 hover:text-blue-300 border border-slate-700/50 hover:border-blue-500/30 transition-all text-left flex items-center gap-2">
                          <i class="fa-solid fa-chart-line text-blue-400"></i> Show Trends
                      </button>
                      <button @click="runMenuAction('export-chat')" class="text-xs py-2 px-3 rounded-lg bg-slate-800/50 hover:bg-emerald-500/20 hover:text-emerald-300 border border-slate-700/50 hover:border-emerald-500/30 transition-all text-left flex items-center gap-2">
                          <i class="fa-solid fa-file-export text-emerald-400"></i> Export Chat
                      </button>
                      <button @click="runMenuAction('clear-chat')" class="text-xs py-2 px-3 rounded-lg bg-slate-800/50 hover:bg-slate-500/20 hover:text-slate-300 border border-slate-700/50 hover:border-slate-500/30 transition-all text-left flex items-center gap-2">
                          <i class="fa-solid fa-eraser text-slate-400"></i> Clear Chat
                      </button>
                      <button @click="runMenuAction('sos')" class="text-xs py-2 px-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 hover:text-red-200 border border-red-500/30 hover:border-red-500/50 transition-all text-left flex items-center gap-2 text-red-400 font-bold col-span-2 justify-center">
                          <i class="fa-solid fa-truck-medical"></i> TRIGGER EMERGENCY SOS
                      </button>
                  </div>
              </div>

              <div class="flex-1 relative flex flex-col overflow-hidden">
                  
                  <div v-if="showPromptLibrary" class="absolute inset-0 z-40 bg-[#080b13]/95 backdrop-blur-xl flex flex-col">
                      <div class="p-4 border-b border-white/5 flex justify-between items-center bg-[#121827]/80">
                          <h4 class="text-sm font-bold text-amber-400"><i class="fa-solid fa-lightbulb text-amber-500 mr-2"></i>Command Library</h4>
                          <button @click="showPromptLibrary = false" class="text-slate-400 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
                      </div>
                      <div class="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                          <div v-for="category in promptCategories" :key="category.title">
                              <h5 class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">{{ category.title }}</h5>
                              <div class="grid grid-cols-1 gap-2">
                                  <button v-for="prompt in category.prompts" :key="prompt" @click="runSuggestion(prompt); showPromptLibrary = false;" class="px-4 py-3 bg-[#1e293b]/60 hover:bg-amber-900/30 border border-slate-700/50 hover:border-amber-500/50 rounded-xl text-[13px] text-slate-300 hover:text-amber-100 transition-all text-left shadow-sm flex items-center gap-3">
                                      <i class="fa-solid fa-terminal text-slate-500 text-[10px]"></i> {{ prompt }}
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div ref="chatContainerRef" class="flex-1 overflow-y-auto p-4 space-y-5 scroll-smooth bg-[#080b13] relative custom-scrollbar pb-6">
                      <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] pointer-events-none"></div>
                      
                      <div v-for="(message, index) in enrichedChatMessages" :key="index" class="flex flex-col relative z-10" :class="message.role === 'user' ? 'items-end' : 'items-start'">
                          
                          <div v-if="message.role === 'assistant'" class="flex items-end gap-2 max-w-[92%]">
                              <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shrink-0 shadow-sm mb-1 text-white">
                                  <i class="fa-solid fa-user-doctor text-[13px]" v-if="assistantRole === 'doctor'"></i>
                                  <i class="fa-solid fa-user-nurse text-[13px]" v-else-if="assistantRole === 'nurse'"></i>
                                  <i class="fa-regular fa-face-smile text-[13px]" v-else></i>
                              </div>
                              <div class="rounded-2xl rounded-bl-sm px-4 py-3 bg-[#1e293b] border border-slate-700 text-[14px] text-slate-200 leading-relaxed shadow-md break-words w-full">
                                  
                                  <div class="whitespace-pre-wrap font-normal" v-html="formatMarkdown(message.rich.intro || message.text)"></div>
                                  
                                  <div v-if="message.rich.hasChart" class="mt-3 overflow-hidden rounded-xl border border-slate-700/60 bg-[#0b1120] p-2 shadow-inner">
                                      <div class="flex items-center justify-between mb-2 px-1">
                                          <p class="text-[10px] font-bold text-cyan-400 tracking-wider uppercase"><i class="fa-solid fa-chart-pie mr-1" v-if="message.rich.chartType === 'pie'"></i><i class="fa-solid fa-chart-area mr-1" v-else></i> Data Visualization</p>
                                          <span class="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                                      </div>
                                      <apexchart :type="message.rich.chartType" height="180" :options="message.rich.chartOptions" :series="message.rich.chartSeries"></apexchart>
                                  </div>

                                  <div v-if="message.rich.hasTable && !message.rich.hasChart" class="overflow-hidden rounded-lg border border-slate-700/80 bg-[#0a0f1c] mt-3">
                                      <table class="w-full text-xs text-left">
                                          <thead>
                                              <tr class="bg-slate-800/50 text-cyan-300">
                                                  <th v-for="(header, hIndex) in message.rich.headers" :key="`h-${hIndex}`" class="px-3 py-2 font-semibold border-b border-slate-700/80">{{ header }}</th>
                                              </tr>
                                          </thead>
                                          <tbody>
                                              <tr v-for="(row, rowIndex) in message.rich.rows" :key="`r-${rowIndex}`" class="even:bg-[#111827]">
                                                  <td v-for="(cell, cIndex) in row" :key="`c-${rowIndex}-${cIndex}`" class="px-3 py-2 border-b border-slate-800 text-slate-300">{{ cell }}</td>
                                              </tr>
                                          </tbody>
                                      </table>
                                  </div>

                                  <div class="whitespace-pre-wrap mt-2 font-normal" v-if="message.rich.outro" v-html="formatMarkdown(message.rich.outro)"></div>
                              </div>
                          </div>

                          <div v-else class="flex items-end gap-2 max-w-[85%]">
                              <div class="rounded-2xl rounded-br-sm px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-[14px] text-white leading-relaxed shadow-md break-words border border-cyan-500/30">
                                  {{ message.text }}
                              </div>
                          </div>
                      </div>

                      <div v-if="chatLoading" class="flex items-end gap-2 max-w-[85%] relative z-10">
                          <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shrink-0 shadow-sm mb-1 text-white opacity-80">
                              <i class="fa-regular fa-face-smile text-[13px]"></i>
                          </div>
                          <div class="rounded-2xl rounded-bl-sm px-4 py-3.5 bg-[#1e293b] border border-slate-700 flex items-center gap-1.5 shadow-md">
                              <div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0s;"></div>
                              <div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.15s;"></div>
                              <div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.3s;"></div>
                          </div>
                      </div>
                  </div>
              </div>

              <div class="p-3 bg-[#080b13] border-t border-slate-800 shrink-0 flex flex-col gap-2 relative shadow-[0_-10px_20px_rgba(0,0,0,0.2)] z-20">
                  
                  <div ref="suggestionsRef" @wheel.prevent="handleSuggestionScroll" class="flex gap-2 overflow-x-auto pb-2 custom-scrollbar-horizontal px-1 w-full max-w-full" v-if="activeSuggestions.length > 0">
                      <button v-for="(sug, idx) in activeSuggestions" :key="idx" @click="runSuggestion(sug.query || sug)"
                          class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1e293b]/60 border border-slate-700/50 hover:bg-cyan-900/60 hover:border-cyan-500/50 text-xs text-slate-200 hover:text-white whitespace-nowrap transition-all shadow-sm backdrop-blur-sm group shrink-0">
                          <i :class="sug.icon || 'fa-solid fa-sparkles'" class="text-cyan-400 group-hover:text-cyan-300"></i> 
                          {{ sug.text || sug }}
                      </button>
                  </div>

                  <form @submit.prevent="handleChatSubmit" class="flex items-end gap-2 bg-[#121827] rounded-2xl border border-slate-700 p-1.5 focus-within:border-cyan-500/70 focus-within:bg-[#161d2f] focus-within:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all relative group">
                      
                      <button type="button" @click="toggleVoiceCommand" :class="isListening ? 'text-red-400 bg-red-400/10' : 'text-slate-400 hover:text-cyan-400 hover:bg-white/5'" class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors z-10">
                          <i class="fa-solid fa-microphone"></i>
                      </button>
                      
                      <textarea 
                          v-model="chatInput" 
                          @keydown.enter.prevent="handleChatSubmit"
                          placeholder="Type a message..." 
                          class="flex-1 bg-transparent text-[14px] text-white placeholder-slate-500 py-2.5 px-1 focus:outline-none resize-none max-h-32 min-h-[44px] overflow-y-auto custom-scrollbar z-10 leading-relaxed"
                          rows="1"
                      ></textarea>

                      <button type="submit" :disabled="chatLoading || !chatInput.trim() || !geminiApiKey" class="w-10 h-10 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md z-10 border border-cyan-500 hover:border-cyan-400">
                          <i class="fa-solid fa-paper-plane text-sm translate-x-[-1px] translate-y-[1px]"></i>
                      </button>
                  </form>
                  <div class="flex justify-between items-center px-2 mt-1">
                      <span class="text-[10px] text-slate-500 flex items-center gap-1.5 font-medium tracking-wider">
                         <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]"></div> SECURE
                      </span>
                      <div class="flex items-center gap-4">
                          <button type="button" @click="sendQuickReaction('👍')" class="text-[12px] font-semibold text-slate-500 hover:text-cyan-400 transition-colors flex items-center gap-1" title="Thanks">👍</button>
                          <button type="button" @click="sendQuickReaction('📈 How is my trend looking?')" class="text-[11px] font-semibold text-slate-500 hover:text-cyan-400 transition-colors flex items-center gap-1" title="Trend Chart"><i class="fa-solid fa-chart-line"></i> Chart</button>
                      </div>
                  </div>
              </div>
          </div>

          <button v-else @click="chatOpen = true" class="ml-auto flex items-center gap-3 px-6 py-4 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 border border-cyan-400/50 hover:border-cyan-300 text-white shadow-[0_10px_25px_rgba(6,182,212,0.3)] hover:shadow-[0_10px_35px_rgba(6,182,212,0.5)] transition-all transform hover:-translate-y-1">
              <i class="fa-regular fa-face-smile text-xl text-white"></i>
              <span class="text-[15px] font-bold tracking-wide">Chat with MediBuddy</span>
          </button>
      </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch, h } from 'vue';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref as dbRef, onValue } from 'firebase/database';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { GoogleGenAI } from '@google/genai';

// ==================== HISTORY TABLE COMPONENT ====================
const HistoryTable = (props) => {
    return h('table', { class: 'w-full text-left border-separate border-spacing-0' }, [
        h('thead', { class: 'sticky top-0 z-20 shadow-md' }, [
            h('tr', { class: 'text-gray-400 text-sm' }, [
                h('th', { class: 'py-4 px-6 font-medium bg-[#1A1F2C] border-b border-gray-700' }, 'Record ID'),
                h('th', { class: 'py-4 px-6 font-medium bg-[#1A1F2C] border-b border-gray-700' }, 'Date & Time'),
                h('th', { class: 'py-4 px-6 font-medium bg-[#1A1F2C] border-b border-gray-700' }, 'BPM'),
                h('th', { class: 'py-4 px-6 font-medium bg-[#1A1F2C] border-b border-gray-700' }, 'Status')
            ])
        ]),
        h('tbody', { class: 'divide-y divide-gray-800/50' }, [
            props.records.length === 0
                ? props.firestoreError
                    ? h('tr', [h('td', { colspan: 4, class: 'py-12 text-center text-red-500 bg-[#0B0F19]/50' }, 'Firestore database connection error')])
                    : h('tr', [h('td', { colspan: 4, class: 'py-12 text-center text-gray-500 bg-[#0B0F19]/50' }, 'No records found.')])
                : props.records.map(record => h('tr', { key: record.id, class: 'bg-[#0B0F19]/30 hover:bg-[#1A1F2C] transition-colors' }, [
                    h('td', { class: 'py-4 px-6 text-xs text-gray-500 font-mono' }, record.id.slice(0, 8) + '...'),
                    h('td', { class: 'py-4 px-6 text-sm text-gray-300' }, record.datetime),
                    h('td', { class: 'py-4 px-6 font-bold text-white' }, record.bpm),
                    h('td', { class: 'py-4 px-6' }, [
                        h('span', { class: `px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(record.status)}` }, record.status)
                    ])
                ]))
        ])
    ]);
};

// ==================== FIREBASE CONFIG ====================
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: "ecgpocket-c5b8a.firebaseapp.com",
    databaseURL: "https://ecgpocket-c5b8a-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "ecgpocket-c5b8a",
    storageBucket: "ecgpocket-c5b8a.firebasestorage.app",
    messagingSenderId: "1015742861284",
    appId: "1:1015742861284:web:0335ad59e02908f33cc1f1"
};

const firebaseApp = initializeApp(firebaseConfig);
const rtdb = getDatabase(firebaseApp);
const firestore = getFirestore(firebaseApp);

// ==================== STATES & FORMATTERS ====================
const activeTab = ref('dashboard');
const activeFilter = ref('Today');
const isConnected = ref(false);
const firestoreError = ref('');
const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

const searchQuery = ref('');

const formatVN = (dateObj) => {
    const d = String(dateObj.getDate()).padStart(2, '0');
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const y = dateObj.getFullYear();
    return `${d}/${m}/${y}`;
};

const currentBpm = ref(0);
const currentStatus = ref('');
const isMeasuring = ref(false);
let measureTimeout = null;

const recentEntries = ref([]);
const historyRecords = ref([]);
const liveRecords = ref([]);
const chatInput = ref('');
const chatLoading = ref(false);
const chatError = ref('');
const chatOpen = ref(true);
const chatMenuOpen = ref(false);
const chatContainerRef = ref(null);
const suggestionsRef = ref(null);
const clinicalAlerts = ref([]);
const autoMonitorEnabled = ref(true);
const assistantRole = ref('friend');
const tourActive = ref(false);
const tourIndex = ref(0);
const speechSupported = ref(false);
const isListening = ref(false);
const aiClient = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;
const speechRecognitionRef = ref(null);
const lastHighAlertAt = ref(0);
const lastLowAlertAt = ref(0);
const alertThresholdHigh = ref(110);
const alertThresholdLow = ref(55);
const isEmergencyMode = ref(false);
const showAbnormalOverlay = ref(false);
const abnormalOverlayData = ref({ title: '', message: '', bpm: 0 });
const ttsEnabled = ref(false);
const showPromptLibrary = ref(false);
const dynamicSuggestions = ref([]);

const isAmberState = computed(() => {
    return isMeasuring.value && (currentStatus.value === 'Tachycardia' || currentStatus.value === 'Bradycardia');
});

const patientProfile = ref({
    age: 65,
    weight: "75kg",
    conditions: ["Mild Hypertension", "History of Arrhythmia"],
    medications: ["Beta-blockers (morning)"]
});

const suggestedPrompts = [
    { icon: 'fa-solid fa-heart-pulse', text: 'Health Summary', query: 'Can you give me a summary of my recent heart rate readings?' },
    { icon: 'fa-solid fa-chart-pie', text: 'Status Breakdown', query: 'Show me the distribution breakdown of my heart rate statuses.' },
    { icon: 'fa-solid fa-pills', text: 'Log Medication', query: 'I just took my beta-blocker medication.' },
    { icon: 'fa-solid fa-person-running', text: 'Log Activity', query: 'I just finished a 15 minute walk.' }
];

const promptCategories = [
    {
        title: 'Analytics & Trends',
        prompts: [
            'Can you give me a summary of my recent heart rate readings?',
            'Show me the distribution breakdown of my heart rate statuses.',
            'Compare today vs yesterday.',
            'Show my heart rate trend.'
        ]
    },
    {
        title: 'Custom Alerts',
        prompts: [
            'Alert me if my heart rate goes above 120',
            'Alert me if my heart rate goes below 55'
        ]
    },
    {
        title: 'Log Activity & Symptoms',
        prompts: [
            'I just took my beta-blocker medication.',
            'I feel dizzy.',
            'I just finished a 15 minute walk.',
            'I just drank a coffee.'
        ]
    },
    {
        title: 'Emergency & Navigation',
        prompts: [
            'TRIGGER SOS',
            'Take me to reports tab',
            'Show me the calendar'
        ]
    }
];

const activeSuggestions = computed(() => {
    if (dynamicSuggestions.value && dynamicSuggestions.value.length > 0) {
        return dynamicSuggestions.value;
    }
    return chatMessages.value.length <= 2 ? suggestedPrompts : [];
});

const chatMessages = ref([
    {
        role: 'assistant',
        text: "Hi there! I'm your friendly MediBuddy. I'm here to help you understand your heart rate data, spot trends, log your activities, and answer any questions. How can I help you today?"
    }
]);

const scrollToBottom = async () => {
    await nextTick();
    await nextTick();
    if (chatContainerRef.value) {
        chatContainerRef.value.scrollTop = chatContainerRef.value.scrollHeight;
    }
};

const handleSuggestionScroll = (e) => {
    if (suggestionsRef.value) {
        suggestionsRef.value.scrollLeft += e.deltaY;
    }
};

const speakText = (text) => {
    if (!ttsEnabled.value || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const strippedText = text.replace(/[*#]/g, '').replace(/\[.*?\]/g, ''); 
    const utterance = new SpeechSynthesisUtterance(strippedText);
    window.speechSynthesis.speak(utterance);
};

const pushAssistantMessage = async (text) => {
    let cleaned = String(text || '')
        .replace(/\s{2,}/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

    const sugMatch = cleaned.match(/\[SUGGESTIONS:\s*(.*?)\]/);
    if (sugMatch) {
        cleaned = cleaned.replace(sugMatch[0], '').trim();
        dynamicSuggestions.value = sugMatch[1].split('|').map(s => s.trim().replace(/^["']|["']$/g, ''));
    } else {
        dynamicSuggestions.value = []; 
    }

    if (!cleaned) return;
    chatMessages.value.push({ role: 'assistant', text: cleaned });
    speakText(cleaned);
    await scrollToBottom();
};

const parseNumericValue = (value) => {
    const match = String(value || '').match(/-?\d+(?:\.\d+)?/);
    return match ? Number(match[0]) : NaN;
};

const formatMarkdown = (text) => {
    if (!text) return '';
    let html = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em class="text-slate-300 italic">$1</em>');
    html = html.replace(/\n/g, '<br />');
    return html;
};

const parseMarkdownTableBlock = (text) => {
    const lines = String(text || '').split('\n');
    const separatorRegex = /^\s*\|?\s*:?-{1,}:?\s*(\|\s*:?-{1,}:?\s*)+\|?\s*$/;

    let separatorIndex = -1;
    for (let i = 1; i < lines.length; i += 1) {
        if (separatorRegex.test(lines[i]) && lines[i - 1].includes('|')) {
            separatorIndex = i;
            break;
        }
    }

    if (separatorIndex === -1) return null;

    const tableStart = separatorIndex - 1;
    let tableEnd = separatorIndex;

    for (let i = separatorIndex + 1; i < lines.length; i += 1) {
        if (!lines[i].includes('|')) break;
        tableEnd = i;
    }

    const parseRow = (line) => line
        .trim()
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split('|')
        .map(cell => cell.trim());

    const headers = parseRow(lines[tableStart]);
    const rows = lines.slice(separatorIndex + 1, tableEnd + 1)
        .map(parseRow)
        .filter(row => row.length === headers.length);

    if (!headers.length || !rows.length) return null;

    return {
        headers,
        rows,
        intro: lines.slice(0, tableStart).join('\n').trim(),
        outro: lines.slice(tableEnd + 1).join('\n').trim()
    };
};

const buildRichAssistantMessage = (text) => {
    let hasChart = false;
    let chartType = 'area';
    let chartSeries = [];
    let chartOptions = {};
    let intro = String(text || '').trim();
    let outro = '';
    let hasTable = false;
    let headers = [];
    let rows = [];

    if (intro.includes('[SHOW_TREND_CHART]')) {
        intro = intro.replace(/\[SHOW_TREND_CHART\]/g, '').trim();
        hasChart = true;
        chartType = 'area';
        const recent = [...analyticsRecords.value].slice(0, 15).reverse();
        
        chartSeries = [{ name: 'Heart Rate', data: recent.map(r => r.bpm) }];
        chartOptions = {
            chart: { type: 'area', height: 180, toolbar: { show: false }, background: 'transparent', zoom: { enabled: false }, fontFamily: 'inherit' },
            stroke: { curve: 'smooth', width: 2 },
            fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 100] } },
            xaxis: { categories: recent.map(r => r.timeOnly), labels: { style: { colors: '#9CA3AF', fontSize: '10px' } }, tooltip: { enabled: false }, axisBorder: { show: false }, axisTicks: { show: false } },
            yaxis: { labels: { style: { colors: '#9CA3AF', fontSize: '10px' } } },
            theme: { mode: 'dark' },
            colors: ['#06b6d4'],
            dataLabels: { enabled: false },
            tooltip: { theme: 'dark', y: { formatter: val => val + ' BPM' } },
            grid: { borderColor: '#334155', strokeDashArray: 3, padding: { top: 0, right: 10, bottom: 0, left: 10 } }
        };
    } 
    else if (intro.includes('[SHOW_PIE_CHART]')) {
        intro = intro.replace(/\[SHOW_PIE_CHART\]/g, '').trim();
        hasChart = true;
        chartType = 'pie';
        
        let normal = 0, brady = 0, tachy = 0;
        analyticsRecords.value.forEach(r => {
            if (r.status === 'Normal') normal++;
            else if (r.status === 'Bradycardia') brady++;
            else tachy++;
        });
        
        chartSeries = [normal, brady, tachy];
        chartOptions = {
            chart: { type: 'pie', height: 180, background: 'transparent', fontFamily: 'inherit' },
            labels: ['Normal', 'Bradycardia', 'Tachycardia'],
            colors: ['#10B981', '#3B82F6', '#EF4444'],
            theme: { mode: 'dark' },
            stroke: { show: false },
            dataLabels: { enabled: true, style: { fontSize: '10px' }, dropShadow: { enabled: false } },
            legend: { position: 'right', labels: { colors: '#9CA3AF' } }
        };
    } 
    else {
        const parsedTable = parseMarkdownTableBlock(intro);
        if (parsedTable) {
            hasTable = true;
            intro = parsedTable.intro;
            outro = parsedTable.outro;
            headers = parsedTable.headers;
            rows = parsedTable.rows;

            if (rows.length > 0 && headers.length >= 2) {
                let valColIdx = headers.findIndex(h => /bpm|value|average|count|percentage/i.test(h));
                if (valColIdx === -1) valColIdx = 1; 
                let labelColIdx = valColIdx === 0 ? 1 : 0; 

                const categories = rows.map(r => r[labelColIdx]);
                
                const data = rows.map(r => {
                    const match = r[valColIdx]?.match(/-?\d+(?:\.\d+)?/);
                    return match ? Number(match[0]) : null;
                });

                if (data.some(d => d !== null)) {
                    hasChart = true;
                    if (intro.toLowerCase().includes('distribution') || intro.toLowerCase().includes('breakdown') || headers.some(h => /percentage|count/i.test(h))) {
                        chartType = 'pie';
                        chartSeries = data;
                        chartOptions = {
                            chart: { type: 'pie', height: 180, background: 'transparent', fontFamily: 'inherit' },
                            labels: categories,
                            theme: { mode: 'dark' },
                            stroke: { show: false },
                            dataLabels: { enabled: true, style: { fontSize: '10px' }, dropShadow: { enabled: false } },
                            legend: { position: 'right', labels: { colors: '#9CA3AF' } }
                        };
                    } else {
                        chartType = 'area';
                        chartSeries = [{ name: headers[valColIdx], data }];
                        chartOptions = {
                            chart: { type: 'area', height: 180, toolbar: { show: false }, background: 'transparent', zoom: { enabled: false }, fontFamily: 'inherit' },
                            stroke: { curve: 'smooth', width: 2 },
                            fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 100] } },
                            xaxis: { categories, labels: { style: { colors: '#9CA3AF', fontSize: '10px' } }, tooltip: { enabled: false }, axisBorder: { show: false }, axisTicks: { show: false } },
                            yaxis: { labels: { style: { colors: '#9CA3AF', fontSize: '10px' } } },
                            theme: { mode: 'dark' },
                            colors: ['#06b6d4'],
                            dataLabels: { enabled: false },
                            tooltip: { theme: 'dark', y: { formatter: val => val + ' BPM' } },
                            grid: { borderColor: '#334155', strokeDashArray: 3, padding: { top: 0, right: 10, bottom: 0, left: 10 } }
                        };
                    }
                }
            }
        }
    }

    return {
        hasTable,
        hasChart,
        chartType,
        intro,
        outro,
        headers,
        rows,
        chartSeries,
        chartOptions
    };
};

const enrichedChatMessages = computed(() => chatMessages.value.map(message => {
    if (message.role !== 'assistant') {
        return {
            ...message,
            rich: { hasTable: false, hasChart: false, intro: '', outro: '', headers: [], rows: [] }
        };
    }
    return { ...message, rich: buildRichAssistantMessage(message.text) };
}));

const sendQuickReaction = async (emoji) => {
    if (!emoji) return;
    chatMessages.value.push({ role: 'user', text: emoji });
    await scrollToBottom();
    if (emoji.includes('📈')) {
        analyzeWithGemini('Can you show me a trend of my recent readings?');
    } else {
        pushAssistantMessage(`I'm glad I could help! Just let me know if you want to look at more data or if you have any questions.`);
    }
};

const deriveStatusFromBpm = (bpm) => {
    if (bpm < 60) return 'Bradycardia';
    if (bpm > 100) return 'Tachycardia';
    return 'Normal';
};

const buildDisplayRecord = (id, bpm, status, timestamp) => {
    const recDateObj = new Date(timestamp);
    return {
        id,
        bpm: Number(bpm),
        status,
        timestamp,
        dateOnly: formatVN(recDateObj),
        datetime: recDateObj.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }),
        timeOnly: recDateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };
};

const pushLiveRecord = (bpm, status) => {
    if (!Number.isFinite(bpm) || bpm <= 0) return;

    const timestamp = Date.now();
    const latest = liveRecords.value[0];
    const shouldAdd = !latest
        || (timestamp - latest.timestamp) >= 10000
        || Math.abs(Number(latest.bpm || 0) - bpm) >= 6
        || latest.status !== status;

    if (!shouldAdd) return;

    const record = buildDisplayRecord(`live-${timestamp}`, bpm, status, timestamp);
    liveRecords.value = [record, ...liveRecords.value].slice(0, 180);
};

// Analytics records logic matching Code 1 layout structure with merged list from Code 2
const combinedRecords = computed(() => {
    const merged = [...liveRecords.value, ...historyRecords.value];
    return merged.sort((a, b) => b.timestamp - a.timestamp);
});

const analyticsRecords = computed(() => {
    return [...historyRecords.value].sort((a, b) => b.timestamp - a.timestamp);
});

const totalRecords = computed(() => analyticsRecords.value.length);

const averageBpm = (records) => {
    if (!records.length) return 0;
    const total = records.reduce((sum, record) => sum + Number(record.bpm || 0), 0);
    return Math.round(total / records.length);
};

const todayDateLabel = formatVN(new Date());

const yesterdayDateLabel = (() => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return formatVN(date);
})();

const latestRecord = computed(() => combinedRecords.value[0] || null);

const todayRecords = computed(() => analyticsRecords.value.filter(record => record.dateOnly === todayDateLabel));

const yesterdayRecords = computed(() => analyticsRecords.value.filter(record => record.dateOnly === yesterdayDateLabel));

const recentSummary = computed(() => {
    if (!recentEntries.value.length) return 'No recent records are available yet.';
    return recentEntries.value
        .slice(0, 3)
        .map(record => `${record.timeOnly} - ${record.bpm} bpm (${record.status})`)
        .join(' | ');
});

const dayTrendLabel = computed(() => {
    if (!todayRecords.value.length && !yesterdayRecords.value.length) return 'No data yet';
    const todayAvg = averageBpm(todayRecords.value);
    const yesterdayAvg = averageBpm(yesterdayRecords.value);

    if (!yesterdayRecords.value.length) return `Today avg ${todayAvg} bpm`;
    const delta = todayAvg - yesterdayAvg;
    const direction = delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat';
    return `${direction} ${Math.abs(delta)} bpm`;
});

const assistantStateText = computed(() => {
    if (!geminiApiKey) return 'API key missing';
    if (chatLoading.value) return 'analyzing';
    if (currentStatus.value === 'Tachycardia' || currentStatus.value === 'Bradycardia') return 'abnormal signal detected';
    return 'monitoring stable';
});

const assistantStateClass = computed(() => {
    if (!geminiApiKey) return 'bg-amber-500/20 text-amber-200 border-amber-300/40';
    if (chatLoading.value) return 'bg-cyan-500/20 text-cyan-100 border-cyan-300/40';
    if (currentStatus.value === 'Tachycardia' || currentStatus.value === 'Bradycardia') return 'bg-red-500/20 text-red-100 border-red-300/40';
    return 'bg-emerald-500/20 text-emerald-100 border-emerald-300/40';
});

const roleHintMap = {
    friend: 'Speak as an empathetic, supportive friend. Use natural, warm, conversational language.',
    doctor: 'Speak professionally and concisely. Focus on practical insights and clear data interpretation.',
    nurse: 'Speak very warmly and compassionately. Give comforting and practical advice.'
};

const assistantRoleHint = computed(() => roleHintMap[assistantRole.value] || roleHintMap.friend);

const addClinicalAlert = (title, message, severity = 'low') => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;
    clinicalAlerts.value.unshift({ id, title, message, severity });
    clinicalAlerts.value = clinicalAlerts.value.slice(0, 6);
};

const dismissAlert = (alertId) => {
    clinicalAlerts.value = clinicalAlerts.value.filter(alert => alert.id !== alertId);
};

const acknowledgeAllAlerts = () => {
    clinicalAlerts.value = [];
    pushAssistantMessage('All clear! I’ve dismissed those alerts and I’m actively monitoring your sensor data.');
};

const runRapidAssessment = () => {
    analyzeWithGemini('Please give me a rapid clinical assessment of the current and recent heart rate data. Keep it clear, friendly, and formatted nicely.');
};

const exportClinicalSnapshot = () => {
    const summary = [
        'Clinical Snapshot',
        `Generated: ${new Date().toLocaleString()}`,
        `Latest: ${latestRecord.value ? `${latestRecord.value.bpm} bpm (${latestRecord.value.status})` : 'No data'}`,
        `Trend: ${dayTrendLabel.value}`,
        `Today Avg: ${averageBpm(todayRecords.value)} bpm`,
        `Yesterday Avg: ${averageBpm(yesterdayRecords.value)} bpm`,
        `Recent: ${recentSummary.value}`
    ].join('\n');

    const blob = new Blob([summary], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `clinical-snapshot-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

const triggerEmergency = () => {
    isEmergencyMode.value = true;
    addClinicalAlert('EMERGENCY SOS TRIGGERED', 'Immediate attention required. Exporting snapshot.', 'high');
    exportClinicalSnapshot();
    
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, ctx.currentTime); 
        osc.connect(ctx.destination);
        osc.start();
        setTimeout(() => osc.stop(), 800);
    } catch(e) { console.log('Audio context blocked'); }

    pushAssistantMessage('**EMERGENCY MODE ACTIVATED**. I have logged this critical event and exported your recent vitals automatically. Please seek immediate medical attention or call emergency services right away.');
};

const playWarningBeep = () => {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, ctx.currentTime); 
        osc.connect(ctx.destination);
        osc.start();
        setTimeout(() => osc.stop(), 400);
    } catch(e) { console.log('Audio context blocked'); }
};

const exportChatHistory = () => {
    const content = chatMessages.value.map(m => `${m.role.toUpperCase()} (${new Date().toLocaleTimeString()}): ${m.text}`).join('\n\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `medibuddy-chat-export-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

const setupSpeechRecognition = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    speechSupported.value = Boolean(SpeechRecognition);
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript?.trim();
        if (!transcript) return;
        chatInput.value = transcript;
    };

    recognition.onstart = () => isListening.value = true;
    recognition.onend = () => isListening.value = false;
    recognition.onerror = () => isListening.value = false;
    speechRecognitionRef.value = recognition;
};

const toggleVoiceCommand = () => {
    if (!speechRecognitionRef.value) {
        pushAssistantMessage('Voice command is not supported in this browser yet, sorry about that!');
        return;
    }
    if (isListening.value) {
        speechRecognitionRef.value.stop();
        return;
    }
    speechRecognitionRef.value.start();
};

const websiteStructureSummary = [
    'Dashboard tab: Live Monitor, Recent Entries, Measurement Density, All Measurements History.',
    'Reports tab: Quick Stats, Status Distribution, Clinical Command Center, Full Measurements Log.',
    'Calendar tab: Calendar View and Selected Day Details.'
].join('; ');

const sectionNavigationMap = [
    { keywords: ['dashboard', 'home', 'live monitor', 'pulse'], tab: 'dashboard', section: 'live-monitor', label: 'Dashboard' },
    { keywords: ['reports', 'analytics', 'quick stats'], tab: 'reports', section: 'quick-stats', label: 'Reports' },
    { keywords: ['calendar', 'day details'], tab: 'calendar', section: 'calendar-view', label: 'Calendar View' },
];

const findNavigationIntent = (message) => {
    const normalized = message.toLowerCase();
    const wantsNavigation = ['go', 'open', 'take me', 'show me', 'navigate'].some(word => normalized.includes(word));
    for (const route of sectionNavigationMap) {
        if (route.keywords.some(keyword => normalized.includes(keyword)) && wantsNavigation) {
            return route;
        }
    }
    return null;
};

const navigateToSection = async (route) => {
    if (route.tab && ['dashboard', 'reports', 'calendar'].includes(route.tab)) {
        activeTab.value = route.tab;
    }
    await nextTick();
    if (route.section) {
        const target = document.querySelector(`[data-section="${route.section}"]`);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
};

const runSuggestion = (query) => {
    chatInput.value = query;
    handleChatSubmit();
};

const buildGeminiPrompt = (userMessage) => {
    const latest = latestRecord.value
        ? `${latestRecord.value.bpm} bpm, status ${latestRecord.value.status}, recorded at ${latestRecord.value.datetime}`
        : 'No latest record available.';

    const conversationContext = chatMessages.value
        .slice(-4)
        .map(message => `${message.role === 'user' ? 'User' : 'Assistant'}: ${message.text}`)
        .join('\n');

    const recentRecordsStr = combinedRecords.value.slice(0, 20)
        .reverse()
        .map(r => `- [${r.datetime}]: ${r.bpm} bpm (${r.status})`)
        .join('\n');

    return `You are MediBuddy, an integrated app assistant for a heart rate monitoring dashboard.
Current persona: ${assistantRole.value} (${assistantRoleHint.value})

PATIENT PROFILE:
Age: ${patientProfile.value.age}, Weight: ${patientProfile.value.weight}
Conditions: ${patientProfile.value.conditions.join(', ')}
Medications: ${patientProfile.value.medications.join(', ')}

APP CONTEXT:
Tabs available: ${websiteStructureSummary}
Latest Reading: ${latest}
Today's Avg: ${averageBpm(todayRecords.value)} bpm.

RECENT 20 READINGS (FULL DATE/TIME CONTEXT):
${recentRecordsStr}

CONVERSATION HISTORY:
${conversationContext || 'No previous conversation.'}

STRICT RULES (Adhere carefully):
1. TONE: Act exactly like a friendly, supportive companion. Use natural, conversational language. Avoid sounding rigid. Use the date/time info to provide smart temporal insights.
2. CONCISENESS: Keep your answers detailed but concise. Avoid "yapping".
3. BOLDING RULES: Always wrap any numeric values (like BPM) and health statuses (like Normal, Bradycardia, Tachycardia) in **double asterisks** to make them bold.
4. CHARTS & GRAPHS: If asked for a trend, history, or graph, output a brief summary and EXACTLY the token \`[SHOW_TREND_CHART]\`. DO NOT generate markdown tables.
5. DISTRIBUTION PIE CHART: If the user asks for a "distribution", "breakdown", or "pie chart", output a brief summary and EXACTLY the token \`[SHOW_PIE_CHART]\`.
6. SUGGESTIONS: Always provide 2 short follow-up questions the user can ask, formatted exactly at the very end of your message like this: [SUGGESTIONS: "question 1" | "question 2"]

USER'S MESSAGE:
${userMessage}

RESPONSE:`;
};

const analyzeWithGemini = async (overrideMessage = null) => {
    const userMessage = (overrideMessage || chatInput.value).trim();
    if (!userMessage || chatLoading.value) return;

    const lowerMsg = userMessage.toLowerCase();
    if (lowerMsg.includes('sos') || lowerMsg.includes('emergency') || lowerMsg.includes('help me') || lowerMsg.includes('heart attack')) {
        chatInput.value = '';
        triggerEmergency();
        return;
    }
    
    const highMatch = lowerMsg.match(/alert me if .* above (\d+)/);
    if (highMatch) {
        alertThresholdHigh.value = parseInt(highMatch[1]);
        chatInput.value = '';
        pushAssistantMessage(`Got it. I've updated your high heart rate alert threshold to **${alertThresholdHigh.value} BPM**.`);
        return;
    }

    const lowMatch = lowerMsg.match(/alert me if .* below (\d+)/);
    if (lowMatch) {
        alertThresholdLow.value = parseInt(lowMatch[1]);
        chatInput.value = '';
        pushAssistantMessage(`Understood. I will alert you if your heart rate drops below **${alertThresholdLow.value} BPM**.`);
        return;
    }

    if (!geminiApiKey) {
        chatError.value = 'Missing VITE_GEMINI_API_KEY in .env.local.';
        pushAssistantMessage('I am missing my API key right now, so I cannot process that request. [SUGGESTIONS: "What is my latest reading?" | "Check sensor status"]');
        return;
    }

    chatError.value = '';
    chatMessages.value.push({ role: 'user', text: userMessage });
    chatInput.value = '';
    
    await scrollToBottom();

    const route = findNavigationIntent(userMessage);
    if (route) {
        await navigateToSection(route);
        pushAssistantMessage(`Sure! I've taken you to the ${route.label}. [SUGGESTIONS: "Explain this data" | "Go back to dashboard"]`);
        return;
    }

    chatLoading.value = true;
    await scrollToBottom();

    try {
        if (!aiClient) throw new Error('Client is not initialized.');

        const response = await aiClient.models.generateContent({
            model: 'gemma-4-26b-a4b-it',
            contents: buildGeminiPrompt(userMessage),
            generationConfig: {
                temperature: 0.7,
                topP: 0.9,
                maxOutputTokens: 400
            }
        });

        const answer = response?.text?.trim();
        if (!answer) throw new Error('Returned an empty response.');

        await pushAssistantMessage(answer);
    } catch (error) {
        chatError.value = error?.message || 'Unable to generate a response right now.';
        pushAssistantMessage('Oops, I had a little trouble connecting to my brain! Your latest reading is ' + (latestRecord.value ? `**${latestRecord.value.bpm} bpm**.` : 'not available yet.') + ' [SUGGESTIONS: "Try again" | "Show my stats"]');
    } finally {
        chatLoading.value = false;
        await scrollToBottom();
    }
};

const handleChatSubmit = () => {
    analyzeWithGemini();
};

const clearChatHistory = async () => {
    chatMessages.value = [{ role: 'assistant', text: "Chat history cleared! Whenever you're ready, I'm here." }];
    dynamicSuggestions.value = [];
    chatMenuOpen.value = false;
    await scrollToBottom();
};

const runMenuAction = async (actionId) => {
    chatMenuOpen.value = false;
    if (actionId === 'rapid') return runRapidAssessment();
    if (actionId === 'history-trend') return analyzeWithGemini('Can you give me a structured table showing my recent history and heart rate trend?');
    if (actionId === 'clear-chat') return clearChatHistory();
    if (actionId === 'sos') return triggerEmergency();
    if (actionId === 'export-chat') return exportChatHistory();
};

watch(currentBpm, (bpm) => {
    if (!autoMonitorEnabled.value || !isMeasuring.value || !bpm) return;
    const now = Date.now();

    if (bpm > alertThresholdHigh.value && now - lastHighAlertAt.value > 45000) {
        lastHighAlertAt.value = now;
        addClinicalAlert('High heart-rate detected', `Live BPM reached ${bpm}. Exceeds threshold of ${alertThresholdHigh.value}.`, 'high');
        abnormalOverlayData.value = { title: 'TACHYCARDIA ALERT', message: `Your heart rate has exceeded the safe threshold of ${alertThresholdHigh.value} BPM. Please rest and monitor your condition.`, bpm };
        showAbnormalOverlay.value = true;
        playWarningBeep();
    } else if (bpm < alertThresholdLow.value && now - lastLowAlertAt.value > 45000) {
        lastLowAlertAt.value = now;
        addClinicalAlert('Low heart-rate detected', `Live BPM dropped to ${bpm}. Below threshold of ${alertThresholdLow.value}.`, 'high');
        abnormalOverlayData.value = { title: 'BRADYCARDIA ALERT', message: `Your heart rate has dropped below the safe threshold of ${alertThresholdLow.value} BPM. Please check your sensor or seek assistance.`, bpm };
        showAbnormalOverlay.value = true;
        playWarningBeep();
    }
});

watch(latestRecord, (newRecord, oldRecord) => {
    if (!newRecord || newRecord.id === oldRecord?.id) return;
    if (newRecord.id.startsWith('live-')) return;
    if (newRecord.status === 'Tachycardia' || newRecord.status === 'Bradycardia') {
        addClinicalAlert('Abnormal record synced', `${newRecord.status}: ${newRecord.bpm} bpm at ${newRecord.timeOnly}.`, 'medium');
    }
});

const filteredHistoryRecords = computed(() => {
    if (!searchQuery.value) return analyticsRecords.value;
    const query = searchQuery.value.toLowerCase().trim();
    return analyticsRecords.value.filter(record => {
        return record.id.toLowerCase().includes(query) ||
               String(record.bpm).includes(query) ||
               record.status.toLowerCase().includes(query) ||
               record.datetime.toLowerCase().includes(query);
    });
});

const reportStats = computed(() => {
    const total = analyticsRecords.value.length;
    if (total === 0) return { avgBpm: 0, maxBpm: 0, minBpm: 0, bradycardiaPct: 0, normalPct: 0, tachycardiaPct: 0 };
    
    let sum = 0, max = 0, min = 999;
    let brady = 0, normal = 0, tachy = 0;

    analyticsRecords.value.forEach(r => {
        sum += r.bpm;
        if(r.bpm > max) max = r.bpm;
        if(r.bpm < min) min = r.bpm;
        
        if(r.status === 'Bradycardia') brady++;
        else if(r.status === 'Normal') normal++;
        else if(r.status === 'Tachycardia') tachy++;
    });

    return {
        avgBpm: Math.round(sum / total),
        maxBpm: max,
        minBpm: min === 999 ? 0 : min,
        bradycardiaPct: Math.round((brady / total) * 100),
        normalPct: Math.round((normal / total) * 100),
        tachycardiaPct: Math.round((tachy / total) * 100)
    };
});

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());
const selectedDate = ref(formatVN(new Date()));

const changeMonth = (step) => {
    let newMonth = currentMonth.value + step;
    if (newMonth > 11) { newMonth = 0; currentYear.value++; }
    else if (newMonth < 0) { newMonth = 11; currentYear.value--; }
    currentMonth.value = newMonth;
};

const selectDay = (day) => {
    if(!day.empty) selectedDate.value = day.dateOnly;
};

const selectedDateRecords = computed(() => {
    return analyticsRecords.value.filter(r => r.dateOnly === selectedDate.value);
});

const calendarDays = computed(() => {
    const year = currentYear.value;
    const month = currentMonth.value;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayStr = formatVN(new Date());

    const days = [];
    for (let i = 0; i < firstDay; i++) days.push({ empty: true });
    
    for (let i = 1; i <= daysInMonth; i++) {
        const dateObj = new Date(year, month, i);
        const checkDateStr = formatVN(dateObj);
        const hasRecord = analyticsRecords.value.some(r => r.dateOnly === checkDateStr);
        const isToday = checkDateStr === todayStr;
        
        days.push({ date: i, empty: false, hasRecord, isToday, dateOnly: checkDateStr });
    }
    return days;
});

// ==================== REAL-TIME CONTINUOUS ECG STATE ====================
const ecgCanvasRef = ref(null);
let canvasCtx = null;
let canvasWidth = 0;
let canvasHeight = 0;
const maxEcgPoints = 350; 
const ecgPoints = [];
let latestSignalVal = 512;
let currentRenderY = null;

const setupCanvas = () => {
    if (ecgCanvasRef.value) {
        canvasCtx = ecgCanvasRef.value.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = ecgCanvasRef.value.getBoundingClientRect();
        ecgCanvasRef.value.width = rect.width * dpr;
        ecgCanvasRef.value.height = rect.height * dpr;
        canvasCtx.scale(dpr, dpr);
        canvasWidth = rect.width;
        canvasHeight = rect.height;

        if (ecgPoints.length === 0) {
            for(let i = 0; i < maxEcgPoints; i++) {
                ecgPoints.push(canvasHeight / 2);
            }
        }
    }
};

const drawECG = () => {
    if (!canvasCtx) {
        requestAnimationFrame(drawECG);
        return; 
    }

    if (canvasHeight > 0) {
        if (currentRenderY === null) currentRenderY = canvasHeight / 2;

        if (!isMeasuring.value) {
            latestSignalVal += (512 - latestSignalVal) * 0.05;
        }

        const safeVal = Math.min(Math.max(latestSignalVal, 0), 1023);
        const targetY = canvasHeight - ((safeVal / 1023) * canvasHeight);

        currentRenderY += (targetY - currentRenderY) * 0.25;

        ecgPoints.push(currentRenderY);
        
        if (ecgPoints.length > maxEcgPoints) {
            ecgPoints.shift();
        }
    }
    
    canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    canvasCtx.beginPath();
    canvasCtx.strokeStyle = isAmberState.value ? '#F59E0B' : '#3B82F6';
    canvasCtx.lineWidth = 2.5;
    canvasCtx.lineJoin = 'round';
    canvasCtx.lineCap = 'round';

    const xStep = canvasWidth / (maxEcgPoints - 1);
    
    for (let i = 0; i < ecgPoints.length; i++) {
        const x = i * xStep;
        const y = ecgPoints[i];

        if (i === 0) canvasCtx.moveTo(x, y);
        else canvasCtx.lineTo(x, y);
    }
    
    canvasCtx.shadowBlur = 8;
    canvasCtx.shadowColor = isAmberState.value ? 'rgba(245, 158, 11, 0.6)' : 'rgba(59, 130, 246, 0.6)';
    canvasCtx.stroke();
    canvasCtx.shadowBlur = 0; 

    requestAnimationFrame(drawECG);
};

watch(activeTab, async (newTab) => {
    if(newTab === 'dashboard') {
        await nextTick();
        setupCanvas();
    }
});

const chartOptions = ref({
    chart: { 
        type: 'bubble', 
        toolbar: { show: false }, 
        zoom: { enabled: false },
        selection: { enabled: false },
        background: 'transparent',
        animations: { enabled: true, easing: 'easeinout', speed: 800 }
    },
    dataLabels: { enabled: false },
    xaxis: {
        type: 'datetime',
        labels: { show: true, style: { colors: '#9CA3AF' }, datetimeUTC: false },
        axisBorder: { show: false },
        axisTicks: { show: false }
    },
    yaxis: {
        min: 30, max: 170, tickAmount: 7,
        labels: { style: { colors: '#9CA3AF' } },
        title: { text: 'Heart Rate (BPM)', style: { color: '#9CA3AF', fontWeight: 500 } }
    },
    grid: { 
        borderColor: '#1F2937', 
        strokeDashArray: 4,
        padding: { left: 20, right: 20, top: 35, bottom: 20 }
    },
    fill: { opacity: 0.8 },
    tooltip: {
        theme: 'dark',
        x: { format: 'dd/MM/yyyy HH:mm' },
        y: { formatter: (val) => val + " BPM" },
        z: { formatter: () => "Heart Rate" }
    }
});

const chartSeries = ref([]);

const updateChartData = () => {
    if (analyticsRecords.value.length === 0) return;
    
    const now = new Date();
    const nowMs = now.getTime();
    let limit = 0;
    let xFormat = 'dd/MM';
    
    if (activeFilter.value === '1h') { 
        limit = nowMs - 3600 * 1000; 
        xFormat = 'HH:mm'; 
    }
    else if (activeFilter.value === 'Today') { 
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        limit = startOfToday; 
        xFormat = 'HH:mm'; 
    }
    else if (activeFilter.value === '7d') { limit = nowMs - 7 * 24 * 3600 * 1000; }
    else if (activeFilter.value === '15d') { limit = nowMs - 15 * 24 * 3600 * 1000; }
    else if (activeFilter.value === '30d') { limit = nowMs - 30 * 24 * 3600 * 1000; }

    let timeDiff = nowMs - limit;
    let paddingX = timeDiff * 0.08; 
    
    if (activeFilter.value === '1h') {
        if (paddingX < 5 * 60 * 1000) paddingX = 5 * 60 * 1000; 
    } else {
        if (paddingX < 2 * 3600 * 1000) paddingX = 2 * 3600 * 1000; 
    }

    chartOptions.value = {
        ...chartOptions.value,
        xaxis: {
            ...chartOptions.value.xaxis,
            min: limit - paddingX,
            max: nowMs + paddingX,
            labels: {
                ...chartOptions.value.xaxis.labels,
                format: xFormat
            }
        }
    };

    const filtered = analyticsRecords.value.filter(r => r.timestamp >= limit);
    const brady = [], normal = [], tachy = [];
    
    filtered.forEach(rec => {
        const point = [rec.timestamp, rec.bpm, 12]; 
        if (rec.bpm < 60) brady.push(point);
        else if (rec.bpm > 100) tachy.push(point);
        else normal.push(point);
    });

    chartSeries.value = [
        { name: 'Bradycardia (<60)', data: brady, color: '#3B82F6' },
        { name: 'Normal (60-100)', data: normal, color: '#10B981' },
        { name: 'Tachycardia (>100)', data: tachy, color: '#EF4444' }
    ];
};

watch(activeFilter, () => { updateChartData(); });

watch(historyRecords, (records) => {
    updateChartData();
    recentEntries.value = records.slice(0, 3);
}, { immediate: true });

const getStatusBgClass = (status) => {
    if(status === 'Normal') return 'bg-gradient-to-br from-teal-500 to-emerald-700';
    if(status === 'Tachycardia') return 'bg-gradient-to-br from-orange-500 to-red-700';
    if(status === 'Bradycardia') return 'bg-gradient-to-br from-blue-500 to-indigo-700';
    return 'bg-gray-800';
};
const getStatusIcon = (status) => {
    if(status === 'Normal') return 'fa-check-circle text-teal-100';
    if(status === 'Tachycardia') return 'fa-arrow-trend-up text-orange-100';
    if(status === 'Bradycardia') return 'fa-arrow-trend-down text-blue-100';
    return 'fa-heart text-gray-100';
};
const getStatusBadgeClass = (status) => {
    if(status === 'Normal') return 'bg-teal-500/20 text-teal-400 border-teal-500/30';
    if(status === 'Tachycardia') return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    if(status === 'Bradycardia') return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
};

onMounted(() => {
    setupSpeechRecognition();
    setupCanvas();
    drawECG();

    onValue(dbRef(rtdb, 'realtime/bpm'), (snapshot) => {
        const val = snapshot.val();
        const bpmVal = Number(val);
        if(Number.isFinite(bpmVal)) {
            isConnected.value = true;
            currentBpm.value = bpmVal;
            
            if(bpmVal === 0) {
                currentStatus.value = 'Preparing...';
            }
            else {
                currentStatus.value = deriveStatusFromBpm(bpmVal);
                pushLiveRecord(bpmVal, currentStatus.value);
            }
        }
    });

    onValue(dbRef(rtdb, 'realtime/signal'), (snapshot) => {
        const rawVal = snapshot.val();
        if(rawVal !== null) {
            isMeasuring.value = true;
            clearTimeout(measureTimeout);
            
            latestSignalVal = rawVal;
            
            measureTimeout = setTimeout(() => {
                isMeasuring.value = false;
            }, 4000); 
        }
    });

    onSnapshot(collection(firestore, "results"), (snapshot) => {
        firestoreError.value = ''; 
        const records = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            let bpmVal = data.bpm !== undefined ? data.bpm : (data.fields?.bpm?.integerValue || 0);
            let statusVal = data.status !== undefined ? data.status : (data.fields?.status?.stringValue || 'Unknown');
            
            let docTimestamp = Date.now();
            if (data.timestamp !== undefined) {
                if (typeof data.timestamp.toMillis === 'function') docTimestamp = data.timestamp.toMillis();
                else docTimestamp = Number(data.timestamp);
            } else if (data.fields?.timestamp?.integerValue) {
                docTimestamp = Number(data.fields?.timestamp?.integerValue);
            } else if (data.createdAt) {
                docTimestamp = Number(data.createdAt);
            }
            
            const recDateObj = new Date(docTimestamp); 
            records.push({
                id: doc.id,
                bpm: Number(bpmVal),
                status: statusVal,
                timestamp: docTimestamp,
                dateOnly: formatVN(recDateObj),
                datetime: recDateObj.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }),
                timeOnly: recDateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
            });
        });
        records.sort((a, b) => b.timestamp - a.timestamp);
        historyRecords.value = records;
    }, (error) => {
        firestoreError.value = "Access denied (Permission Denied error)";
    });
});

onBeforeUnmount(() => {
    if (speechRecognitionRef.value && isListening.value) {
        speechRecognitionRef.value.stop();
    }
});
</script>

<style scoped>
* { color: #e5e7eb; }
h1, h2, h3, h4, h5, h6, .text-white { color: #ffffff; }

.glass-panel {
    background: rgba(17, 24, 39, 0.75);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.08);
}

.heart-pulse {
    animation: pulse 1s infinite;
}

@keyframes pulse {
    0% { transform: scale(1); }
    15% { transform: scale(1.15); }
    30% { transform: scale(1); }
    45% { transform: scale(1.15); }
    100% { transform: scale(1); }
}

.animate-fade-in {
    animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent; 
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15); 
    border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3); 
}

.custom-scrollbar-horizontal::-webkit-scrollbar {
    height: 4px;
}
.custom-scrollbar-horizontal::-webkit-scrollbar-track {
    background: transparent; 
}
.custom-scrollbar-horizontal::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15); 
    border-radius: 10px;
}
.custom-scrollbar-horizontal::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3); 
}

.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

:deep(.apexcharts-tooltip) {
    background: #1F2937 !important;
    border: 1px solid #374151 !important;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5) !important;
    color: #ffffff !important;
}
:deep(.apexcharts-tooltip-title) {
    background: #111827 !important;
    border-bottom: 1px solid #374151 !important;
    color: #ffffff !important;
}
:deep(.apexcharts-tooltip-text) {
    color: #ffffff !important;
}
:deep(.apexcharts-text) {
    fill: #9CA3AF !important;
}

details > summary::-webkit-details-marker {
  display: none;
}
</style>