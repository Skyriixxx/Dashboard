import { Component, OnInit } from '@angular/core';
import { SocialAuthService, GoogleLoginProvider, SocialUser } from 'angularx-social-login';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import {DomSanitizer,SafeResourceUrl} from '@angular/platform-browser';
import { interval } from 'rxjs';
import { userService } from 'src/app/user/user.service';

interface moviesType {
  image?: string
  title: string
  description: string
}

interface youtubeType {
  video: SafeResourceUrl
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit {
  public dateWeatherUpdate = new Date;
  
  public socialUser!: SocialUser;
  public isLoggedin!: boolean;
  public closeResult: string = '';

  public movieName!: string;
  public cityName!: string;
  public youtubeSearch!: string;
  public steamSearch!: string;

  public isWeatherData: boolean = false;
  public isMovieData: boolean = false;
  public isYoutubeData: boolean  = false;
  public isSteamData: boolean = false;

  public weatherData: any = {};
  public youtubeData: any = {};
  public movieData: any = {};
  public steamData: any = {};
  
  public iconWeather!: any;
  public temp!: number
  public weatherDate!: Date

  public movies: moviesType[] = []
  public youtubeVideo: youtubeType[] = []

  public isCinemaServiceActivated: boolean = false;
  public isSteamServiceActivated: boolean = false;
  public isYoutubeServiceActivated: boolean = false;
  public isWeatherServiceActivated: boolean = false;

  public config: PerfectScrollbarConfigInterface = {};

  public user: any

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private socialAuthService: SocialAuthService,
    private modalService: NgbModal,
    private http: HttpClient,
    public sanitizer:DomSanitizer,
    private userService: userService
  ) { }


  ngOnInit(): void {
    this.user = this.userService.getUser();
    if (this.user.widgets.cinema.isActive == true) {
      this.isCinemaServiceActivated = true;
      if (this.user.widgets.cinema.search != '') {
        this.movieName = this.user.widgets.cinema.search
        this.isMovieData = true;
        this.getMovieByName();
      }
    }
    if (this.user.widgets.youtube.isActive == true) {
      this.isYoutubeServiceActivated = true;
      if (this.user.widgets.youtube.search != '') {
        this.youtubeSearch = this.user.widgets.youtube.search
        this.isYoutubeData = true;
        this.getYoutubeVideo();
      }
    }
    if (this.user.widgets.weather.isActive == true) {
      this.isWeatherServiceActivated = true;
      if (this.user.widgets.weather.search != '') {
        this.cityName = this.user.widgets.weather.search
        this.isWeatherData = true;
        this.getWeather();
      }
    }
    console.log('--------------------');
    const timer = interval(60000);
    timer.subscribe((n) => {
      if (this.isWeatherData) {
        this.getWeather();
        this.dateWeatherUpdate = new Date;
      }
    })
  }

  open(content:any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  public clearMovieSearch() {
    this.movies = [];
    this.isMovieData = false;
  }
  public clearYoutubeSearch() {
    this.youtubeVideo = [];
    this.isYoutubeData = false;
  }
  
  public activateOrDesactivateWeather() {
    this.isWeatherServiceActivated = !this.isWeatherServiceActivated;
    if (this.isWeatherServiceActivated) {
      this.setUserService("weather", "");
    }
    if (!this.isWeatherServiceActivated) {
      this.unsetUserService("weather");
    }
  }

  public activateOrDesactivateCinema() {
    this.isCinemaServiceActivated = !this.isCinemaServiceActivated;
    if (this.isCinemaServiceActivated) {
      this.setUserService("cinema", "");
    }
    if (!this.isCinemaServiceActivated) {
      this.unsetUserService("cinema");
    }
  }

  public activateOrDesactivateYoutube() {
    this.isYoutubeServiceActivated = !this.isYoutubeServiceActivated;
    if (this.isYoutubeServiceActivated) {
      this.setUserService("youtube", "");
    }
    if (!this.isYoutubeServiceActivated) {
      this.unsetUserService("youtube");
    }
  }

  public getMovieByName() {
      let i = 0;
      this.http.get<any>("https://api.themoviedb.org/3/search/movie?api_key=6399ea8cda4e2c949c3dd4ecfdedeeff&query=" + this.movieName)
      .subscribe(res => {
        console.log(res);
        this.movieData = res.results
        for (let movie of this.movieData) {
          if (i == 3)
            break;
          this.movies.push({title: movie.title, description: movie.overview, image: movie.poster_path == null ? '' : "https://image.tmdb.org/t/p/w500" + movie.poster_path })
          console.log(this.movies);
          ++i;
        }
      }, err => {
        alert(err);
      })
      this.isMovieData = true
  }

  public getYoutubeVideo() {
    this.http.get<any>("https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=" + this.youtubeSearch  + "&key=AIzaSyDn3HEJ2BeVH71lxPW6mplv6-m29BavaUg")
    .subscribe(res => {
      let urlVideo: string;
      let urlVideoSafe: SafeResourceUrl;
      this.youtubeData = res.items;
      for (let youtube of this.youtubeData) {
        if (youtube.id.kind == 'youtube#video') {
            urlVideo =  "https://www.youtube.com/embed/" + youtube.id.videoId;
            urlVideoSafe = this.sanitizer.bypassSecurityTrustResourceUrl(urlVideo);
            this.youtubeVideo.push({video: urlVideoSafe});
        }
      }
      console.log(this.youtubeVideo);
      console.log(res);
      this.isYoutubeData = true;
    }, err => {
      alert(err);
      this.isYoutubeData = false;
    })
  }
  
  public getWeather() {
    this.http.get<any>("http://api.openweathermap.org/data/2.5/weather?q=" + this.cityName + "&appid=3738bee0a2867ba75295917aecc7b833")
    .subscribe(res => {
      this.weatherData = res;
      this.iconWeather = "http://openweathermap.org/img/wn/" + this.weatherData.weather[0].icon + "@2x.png";
      this.temp = this.weatherData.main.temp - 273.15;
      this.weatherDate = this.dateWeatherUpdate;
      this.isWeatherData = true
    }, err => {
      alert("City is not in the api database");
      this.isWeatherData = false
    })
  }

  public setUserService(service: string, search: string) {
    console.log(service + " " +  search);
    this.http.post<any>("http://localhost:8081/api/widget/" + this.route.snapshot.paramMap.get("user") + '/set',
      { widget: service, search: search }
    )
    .subscribe(res => {
        console.log(res);
    }, err => {
      console.log(err);
    })
  }

  public unsetUserService(service: string) {
    console.log(service);
    this.http.post<any>("http://localhost:8081/api/widget/" + this.route.snapshot.paramMap.get("user") + '/unset',
      { widget: service }
    )
    .subscribe(res => {
        console.log(res);
    }, err => {
      console.log(err);
    })
  }


  // public getSteamUser() {
  //   const headers= new HttpHeaders().set('content-type', 'application/json').set('Access-Control-Allow-Origin', '*');
  //   console.log(headers);
  //   let apiKey: string = "612C2FF24CCB8115253268787D1CED4A"
  //   console.log(this.steamSearch)
  //   this.http.get<any>("http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=612C2FF24CCB8115253268787D1CED4A&format=json&steamids=76561198029174761", {"headers": headers})
  //   .subscribe(res => {
  //     console.log(res);
  //     this.steamData = res.response.player[0]
  //     console.log(this.steamData);
  //   }, err => {
  //     alert("steam user not found");
  //     this.isSteamData = false;
  //   })
  // }

  logOut(): void {
      this.socialAuthService.signOut();
      this.userService.removeUser();
      this.router.navigate(['login']);
  }
}
