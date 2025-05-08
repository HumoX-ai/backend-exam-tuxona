import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { VenuesModule } from './venues/venues.module';
import { BookingsModule } from './bookings/bookings.module';
import { BookmarksController } from './bookmarks/bookmarks.controller';
import { BookmarksService } from './bookmarks/bookmarks.service';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/toyxona',
    ),
    AuthModule,
    UsersModule,
    VenuesModule,
    BookingsModule,
    BookmarksModule,
  ],
  controllers: [AppController, BookmarksController],
  providers: [AppService, BookmarksService],
})
export class AppModule {}
